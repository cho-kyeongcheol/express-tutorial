const express = require('express')
const app = express()
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  var context = {};
  res.render('index', context);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})