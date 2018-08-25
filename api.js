
const path = require('path')
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5301;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'build')));
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

app.get('*', (req, res) => {
  res.send({"ANYTHING?":"YUP"})
  res.sendFile(path.join(__dirname+'build/index.html'));
});

app.listen(port, () => console.log('Auth server listening on port ' + port))
