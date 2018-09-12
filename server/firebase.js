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
  console.log({users})
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
  console.log({surveys})
  const ids = Object.values(surveys).map(s => s.id)
  console.log({ids})
  return ids
}


const surveyObserver = surveysQuery.onSnapshot(querySnapshot => {
  // console.log(`Found ${querySnapshot.size} users`);
  querySnapshot.forEach(function (documentSnapshot) {
    const data = documentSnapshot.data()
    if (data.hasOwnProperty('id')) surveys[data.id] = data
    // console.log({[id]:data})
  })
  console.log({surveys})
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
    /*
    firestore.collection("surveys").doc(surveyId).get().then(doc => {
        if (!doc.exists) resolve(defaultSurvey)
        else resolve(doc.data())
      }).catch(err => {
        reject(err)
      })
    */
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

const addSurveyResults = async(surveyId, results, { firstName, lastName, studentId }) => {
  // Adding a survey result should:
  // 1) Add to the survey results node
  // 2) Update (or create) a user's survey history
  let promise = new Promise(async(resolve, reject) => {
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
  })
  return promise
}

const usersById = {}
const usersByName = {}
const surveyResults = {}

const ref = rt_database.ref('userResultsByFullName')
ref.on("child_added", function(snap) {
  const userSurveyResults = snap.val()
  const keys = Object.keys(userSurveyResults)
  for (let k = 0; k < keys.length; k++) {
    const result = userSurveyResults[keys[k]]
    const { categories, additionalResults, id, firstName, lastName, studentId, time } = result
    const fullName = `${lastName} ${firstName}`
    if (!usersByName.hasOwnProperty(fullName)) usersByName[fullName] = []
    if (!usersById.hasOwnProperty(studentId)) usersById[studentId] = []
    if (!surveyResults.hasOwnProperty(id)) surveyResults[id] = []
    usersById[studentId].push(result)
    usersByName[fullName].push(result)
    surveyResults[id].push(result)
    // result is only linked to by each dictionary here //
  }
})



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
  users,
  setDefault,
  getDefault,
  getSurvey,
  getSurveyIds
}
