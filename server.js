const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser())

app.get('/', (req, res) => {
  var context = {};
  res.render('index', context);
})

app.post('/api/v1/regist', (req, res) => {
  var inputId = req.body.inputId;
  var inputPw = req.body.inputPw;

  console.log('inputId = ', inputId);
  console.log('inputPw = ', inputPw);

  // db insert
  
  res.json({'result': 'success'});
  // res.json({'result': 'fail'});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})