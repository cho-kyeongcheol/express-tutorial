const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
var mysql = require('mysql');
const { ConnectionError } = require('sequelize');

const models = require('./models');
const router = express.Router();

// var sequelize = require('./models').sequelize;
// sequelize.sync();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser())

app.get('/', (req, res) => {
  var context = {};
  res.render('index', context);
})

// router.post('/api/v1/regist', function(req, res, next) {
//   var inputName = req.body.inputName;
//   var inputPw = req.body.inputPw;

// models.post.create({  
//   username: inputName,
//   passowrd: inputPw
// })
// .then( result => {
//   console.log("데이터 추가 완료");  
// })
// .catch( err => {
//   console.log("데이터 추가 실패");
// })
// });



app.post('/api/v1/regist', (req, res) => {
  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;

  var con = mysql.createConnection({
    user: "dev",
    password: "password",
    host: "192.168.33.80",
    database: "database_development"
  });  
  
  console.log('inputName = ', inputName);
  console.log('inputPw = ', inputPw);

  res.send(req.body);

  // db insert
  
  // con.connect(function(err) {  
  //   if (err) throw err;
  //   console.log("Connected!");
  //   //var sql = "INSERT INTO users (id, username, password, create_at, update_at) VALUES ? " ;
  //   models.post.create({
  //       username: inputName,
  //       password: inputPw
  //     });        

  //   con.query(sql, function (err, result) {
  //     if (err) throw err;
  //     console.log("1 record inserted");
  //   });
  // });

  



  // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
  con.connect(function(err) {   // query로 db넣기 성공
    if (err) throw err;
    console.log("Connected!");
    var sql = "INSERT INTO users (username, password, create_at, update_at) VALUES ('"+inputName+"','"+inputPw+"',now(),now())";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record inserted");
    });
  });
  // ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

  // res.json({'result': 'success'});
  // res.json({'result': 'fail'});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = router;