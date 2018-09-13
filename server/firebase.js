const admin = require('firebase-admin')
const config = {
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      databaseURL: process.env.databaseURL,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId
    }

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})


// Using both firestore and the rt_database because Node doesn't have union merge,
// and it costs just as much to access a child doc as a parent doc in firestore
// (so survey results will all be stored in the realtime database;
// this way they will be much cheaper to access in terms of quota usage)
const firestore = admin.firestore()
const rt_database = admin.database()

/*
USERS
*/

const users = {}
const usersQuery = firestore.collection('users');
const observer = usersQuery.onSnapshot(querySnapshot => {
  // console.log(`Found ${querySnapshot.size} users`);
  querySnapshot.forEach(function (documentSnapshot) {
    const data = documentSnapshot.data()
    users[data.email] = data
    // console.log({[id]:data})
  })
}, err => {
  console.log(`Encountered error: ${err}`);
})

const deleteElevatedUser = async(email) => {
  let promise = new Promise(async(resolve, reject) => {
    delete users[email]
    firestore.collection("users").doc(email).delete().then(() => resolve("okay"))
    .catch((e) => reject(e))
  })
  return promise
}

const addOrModifyElevatedUser = async({ name, email, role }) => {
  let promise = new Promise(async(resolve, reject) => {
    users[email] = { name, email, role }
    firestore.collection("users").doc(email).set({
      name,
      email,
      role
    }).then(() => resolve("okay"))
    .catch((e) => reject(e))
  })
  return promise
}

const getUserFromToken = (idToken) => {
  let promise = new Promise(async(resolve, reject) => {
    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {
      const { uid, email } = decodedToken
      resolve(users[email])
    }).catch(function(error) {
      reject(error)
    })
  })
  return promise
}

const getUserByEmail = (email) => {
  let promise = new Promise(async(resolve, reject) => {
    admin.auth().getUserByEmail(email)
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        const { email, displayName: name, uid } = userRecord.toJSON()
        resolve ({ email, displayName: name, uid })
      })
      .catch(function(error) {
        console.log("Error fetching user data:", error);
        reject(error)
      })
    })
    return promise
}

/*
SURVEYS
*/

const surveys = {}
const surveysQuery = firestore.collection('surveys');
const getSurveyIds = () => {
  const ids = Object.values(surveys).map(s => s.id)
  return ids
}


const surveyObserver = surveysQuery.onSnapshot(querySnapshot => {
  // console.log(`Found ${querySnapshot.size} users`);
  querySnapshot.forEach(function (documentSnapshot) {
    const data = documentSnapshot.data()
    if (data.hasOwnProperty('id')) surveys[data.id] = data
    // console.log({[id]:data})
  })
}, err => {
  console.log(`Encountered error: ${err}`);
})

let defaultSurvey
const initializeDefault = async() => {
  firestore.collection("default").doc("default").get().then(doc => {
      firestore.collection("surveys").doc(doc.data().default).get().then(async(doc) => {
          if (!doc.exists) defaultSurvey = null
          else defaultSurvey = doc.data()
        }).catch(err => {
          console.log(err)
        })
    }).catch((e) => console.log(e))
}
initializeDefault()


const setDefault = async(surveyId) => {
  let promise = new Promise(async(resolve, reject) => {
    firestore.collection("default").doc("default").set({ default: surveyId })
      .then(() => {
        firestore.collection("surveys").doc(surveyId).get().then(doc => {
            if (!doc.exists) defaultSurvey = null
            else defaultSurvey = doc.data()
            resolve("okay")
          }).catch(err => {
            reject(err)
          })
      }).catch((e) => reject(e))
  })
  return promise
}

const getDefault = () => defaultSurvey

const getSurvey = (surveyId) => {
  let promise = new Promise(async(resolve, reject) => {
    resolve(surveys[surveyId])
    })
    return promise
}

const addOrModifySurvey = (survey) => {
  let promise = new Promise(async(resolve, reject) => {
    surveys[survey.id] = survey
    firestore.collection("surveys").doc(survey.id).set(survey).then(() => resolve("okay"))
    .catch((e) => reject(e))
  })
  return promise
}

/*
RESULTS
*/

const validateSurvey = (result) => {
  const { id, studentId, firstName, lastName, time } = result
  // returns true if survey ok, otherwise
  if (!id) return "Invalid survey id"
  const survey = surveys[id]
  if (!survey) return "That survey does not exist"
  if (isNaN(studentId)) return "Invalid student id"
  try {
    if (studentId !== "") {
      const stringId = String(studentId)
      if (stringId[0] !== "8" || stringId.length !== 9) return "Invalid student id"
    }
    if (!firstName || !lastName) return "Invalid name"
    if (!time) return "No survey taken time"
    const nCats = result.categories.length
    const nQ = result.additionalQuestions.length
    for (let q = 0; q < nQ; q++) {
      const [ qNumber, qAnswer ] = result.additionalQuestions[q]
      if (!survey.additionalQuestions.hasOwnProperty(qNumber) || isNaN(qAnswer)) return "Invalid survey submission"
    }
    for (let c = 0; c < nCats; c++) {
      const [ catId, catQs ] = result.categories[c]
      if (!survey.categories[catId]) return "Invalid survey submission"
      const nQ = catQs.length
      const maxScore = survey.categories[catId].answers.length+1
      let total = 0
      for (let q = 0; q < nQ; q++) {
        let [ qId, qAns ] = catQs[q]
        if (!survey.categories[catId].questions.hasOwnProperty(qId) || isNaN(qAns)) return "Invalid survey submission"
      }
    }
  } catch (e) {
    return e.message
  }
  return "okay"
}

const addSurveyResults = async(results) => {
  // Adding a survey result should:
  // 0) Validate the results to avoid data corruption, reject if not okay (remember, this function is exposed to anyone)
  // 1) Add to the survey results node
  // 2) Update (or create) a user's survey history
  let promise = new Promise(async(resolve, reject) => {
    const validationMessage = validateSurvey(results)
    if (validationMessage !== "okay") return resolve(validationMessage)
    const resultRef = resultsRef.push()
    resultRef.set(results).then(() => {
      resolve('okay')
    }).catch(e => {
      reject(e)
    })
    /*
    const surveyResultsRef = rt_database.ref('surveyResults').child(surveyId).push()
    const userResultsIdRef = rt_database.ref('userResultsById').child(studentId || 'anon').push()
    const userResultsFullNameRef = rt_database.ref('userResultsByFullName').child(`${lastName} ||| ${firstName}` || 'anon').push()
    const surveyPromise = surveyResultsRef.set(results)
    const userIdPromise = userResultsIdRef.set(results)
    const userFullNamePromise = userResultsFullNameRef.set(results)
    Promise.all([surveyPromise,userIdPromise, userFullNamePromise]).then(() => {
      resolve('okay')
    }).catch(e => {
      reject(e)
    })
    */
  })
  return promise
}

const usersById = {}
const usersByName = {}
const surveyResults = {}
const resultsByInternalKey = {}

const resultsRef = rt_database.ref('results')
resultsRef.on("child_added", function(snap) {
  const key = snap.key
  const result = snap.val()
  const { studentId, lastName, firstName, id } = result
  result.key = key
  const fullName = `${lastName} ${firstName}`
  if (!usersByName.hasOwnProperty(fullName)) usersByName[fullName] = []
  if (!usersById.hasOwnProperty(studentId)) usersById[studentId] = []
  if (!surveyResults.hasOwnProperty(id)) surveyResults[id] = []
  usersById[studentId].push(result)
  usersByName[fullName].push(result)
  surveyResults[id].push(result)
  resultsByInternalKey[key] = result
})



const deleteResult = async(key) => {
  // mark the object as deleted.  It won't actually be removed from result sets until the server somehow restarts,
  // It will, however, be removed from firebase, and the deleted marker should be observed on the front end to be ignored
    let promise = new Promise(async(resolve, reject) => {
      rt_database.ref(`results/${key}`).remove().then(() => {
        const result = resultsByInternalKey[key]
        const { studentId, lastName, firstName, id } = result
        const fullName = `${lastName} ${firstName}`
        delete resultsByInternalKey[key]

        const idIndex = usersById[studentId].map((x,i) => { return [x.key, i]}).filter(x => x[0] === key)[0][1]
        usersById[studentId].splice(idIndex,1)
        if (!usersById[studentId].length) delete usersById[studentId]

        const nameIndex = usersByName[fullName].map((x,i) => { return [x.key, i]}).filter(x => x[0] === key)[0][1]
        usersByName[fullName].splice(nameIndex,1)
        if (!usersByName[fullName].length) delete usersByName[fullName]

        const surveyIndex = surveyResults[id].map((x,i) => { return [x.key, i]}).filter(x => x[0] === key)[0][1]
        surveyResults[id].splice(surveyIndex,1)
        if (!surveyResults[id].length) delete surveyResults[id]

        resolve('okay')
      }).catch(e => {
        resolve(e.message)
      })
    })
    return promise
}


const getUserLists = () => {
  // returns a list of user ids AND names from all survey results
  return { userIds: Object.keys(usersById), userNames: Object.keys(usersByName) }
}

const getSurveyResults = (surveyId) => {
  return surveyResults[surveyId]
}

const getUserResults = (getById=true, id) => {
  // should return a list of all user survey results
  const result = getById ? usersById[id] : usersByName[id]
  return result
}

module.exports = {
  getSurveyResults,
  getUserLists,
  getUserResults,
  addSurveyResults,
  addOrModifySurvey,
  addOrModifyElevatedUser,
  getUserFromToken,
  deleteElevatedUser,
  deleteResult,
  users,
  setDefault,
  getDefault,
  getSurvey,
  getSurveyIds
}
