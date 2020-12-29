const express = require('express')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize');

var render = require('./router/render');
var api = require('./router/api');

const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(bodyParser())

app.use(bodyParser.urlencoded({
  extended: true
}));  // body-parser deprecated bodyParser: use individual json/urlencoded middlewares server.js:15:9 에러가 나서 사용


// session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}));

app.use('/', render);
app.use('/api', api);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;