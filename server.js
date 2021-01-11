const express = require('express')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser')
const { Sequelize, DataTypes } = require('sequelize');
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

var render = require('./router/render');
var api = require('./router/api');

const app = express()
const port = 4000

app.set('view engine', 'ejs');
app.use(express.static('public'));

// app.use(cors({ origin: "http://localhost:3001/" }));
app.use(cors());

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

let running = "load_image";
global.running = running;


// let test = require('./router/api.js'); 
// test.running = 'AAAAA';
//  console.log(test.running);

// console.log('running!@!@#=>', running)

// app.get("/usermodify_img", (req, res) => {  
//   res.sendFile(path.join(__dirname, "./uploads/image.png"));
// });

app.use(express.static('./uploads'));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;