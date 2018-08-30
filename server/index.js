
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5301;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



// This and the wildcard path below serves all static content from the static build of create react app
// during production. If it doesn't exist, it should be development and so is ignored.
const staticBuildPath = path.resolve(__dirname, '../app/build')
if (fs.existsSync(staticBuildPath)) app.use(express.static(staticBuildPath))



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
