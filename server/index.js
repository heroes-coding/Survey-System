
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5301;
const axios = require('axios')

const {  deleteResult, getSurveyResults, getUserLists, getUserResults,addSurveyResults, getSurveyIds, addSurvey, getUserFromToken, users, deleteElevatedUser, addOrModifyElevatedUser, addOrModifySurvey, setDefault, getDefault, getSurvey } = require('./firebase')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// This and the wildcard path below serves all static content from the static build of create react app
// during production. If it doesn't exist, it should be development and so is ignored.
const staticBuildPath = path.resolve(__dirname, '../app/build')
if (fs.existsSync(staticBuildPath)) app.use(express.static(staticBuildPath))

app.post('/getSurveyResults', async function(req, res) {
  const { adminIdToken, surveyId } = req.body
  if (!isCoach(adminIdToken)) return res.send("Nope")
  return res.send(getSurveyResults(surveyId))
})

app.post('/getUserLists', async function(req, res) {
  const { adminIdToken } = req.body
  if (!isCoach(adminIdToken)) return res.send("Nope")
  return res.send(getUserLists())
})

app.post('/getUserResults', async function(req, res) {
  const { adminIdToken, getById, id } = req.body
  if (!isCoach(adminIdToken)) return res.send("Nope")
  return res.send(getUserResults(getById,id))
})



app.post('/getRoleFromIdToken', async function(req, res) {
  const { idToken } = req.body
  const user = await getUserFromToken(idToken)
  return res.send(user ? user.role : "student")
})

app.get('/getUsers', async function(req, res) {
  // these are authorized users
  return res.send(Object.values(users).map(x => {return {email: x.email, name: x.name, role: x.role}}))
})

app.get('/getDefault', async function(req, res) {
  return res.send(getDefault())
})

app.get('/getSurveyIds', async function(req, res) {
  return res.send(getSurveyIds())
})

app.post('/setDefault', async function(req, res) {
  const { adminIdToken, surveyId } = req.body
  if (!isAdmin(adminIdToken)) return res.send("Nope")
  const result = await setDefault(surveyId)
  return res.send(result)
})

// THIS (SELF-PINGING) IS TO KEEP THE HEROKU FREE SERVER ALIVE, HOWEVER IT WILL USE UP THE FREE PLAN'S MINUTES IN ABOUT 20 DAYS
// UNLESS A CREDIT CARD IS PUT ON FILE

app.get('/ping', async function(req, res) {
  return res.send("pong")
})

const pingSelf = async() => {
  const res = await axios.get('https://studentequity.herokuapp.com/ping')
  if (res.data !== "pong") console.log(res.data)
  setTimeout(pingSelf, 600000) // ping every ten minutes indefinitely
}
pingSelf()



app.get('/getSurvey/:surveyId', async(req, res) => {
  // TO DO : get id and password, query for user, if exists check if expires, if expires refresh token if not exists return doesn't exist otherwise return id and password in JSON format
  // this is for automatic logins
  let { surveyId } = req.params
  console.log(req.params,{surveyId})
  let survey = await getSurvey(surveyId)
  console.log({survey})
  res.send(survey)
})

app.post('/addSurveyResults', async function(req, res) {
  const { results } = req.body
  try {
    const result = await addSurveyResults(results)
    return res.send(result)
  } catch (e) {
    return res.send(e.message)
  }
})

/*
setDefault,
getDefault,
getSurvey
*/

const isCoach = async(adminIdToken) => {
  let promise = new Promise(async(resolve, reject) => {
    const user = await getUserFromToken(adminIdToken)
    if (!user || (user.role !=="coach" && user.role !== "admin")) resolve(false)
    else resolve(true)
  })
  return promise
}


const isAdmin = async(adminIdToken) => {
  let promise = new Promise(async(resolve, reject) => {
    const user = await getUserFromToken(adminIdToken)
    if (!user || user.role !=="admin") resolve(false)
    else resolve(true)
  })
  return promise
}

app.post('/addOrModifySurvey', async function(req, res) {
  const { adminIdToken, survey } = req.body
  if (!isAdmin(adminIdToken)) return res.send("Nope")
  const result = await addOrModifySurvey(survey)
  return res.send(result)
})

app.post('/addOrModifyElevatedUser', async function(req, res) {
  const { adminIdToken, user } = req.body
  if (!isAdmin(adminIdToken)) return res.send("Nope")
  const result = await addOrModifyElevatedUser(user)
  return res.send(result)
})

app.post('/deleteElevatedUser', async function(req, res) {
  const { adminIdToken, user } = req.body
  if (!isAdmin(adminIdToken)) return res.send("Nope")
  const result = await deleteElevatedUser(user.email)
  return res.send(result)
})


// set up, not implemented as it requires a restart of the front end.  Hmm... complicated no matter how it is done.
app.post('/deleteResult', async function(req, res) {
  const { adminIdToken, key } = req.body
  if (!isAdmin(adminIdToken)) return res.send("Nope")
  const result = await deleteResult(key)
  return res.send(result)
})


app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:' + port)
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)
  // Pass to next layer of middleware
  next()
})

app.get('/test', async function(req, res) {
  return res.send({HI: "HEY"})
})


// This wildcard path MUST COME after all other paths, and serves static content if built (if in production).
if (fs.existsSync(staticBuildPath)) {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../app/build', 'index.html'))
  })
}


app.listen(port, () => console.log('Auth server listening on port ' + port))
