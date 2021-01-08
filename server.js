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


const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };
  
  const upload = multer({
    dest: "/path/to/temporary/directory/to/store/uploaded/files"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
  
  
  app.post(
    "/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "./uploads/image.png");
      
      console.log('tempPath=>',tempPath)
      console.log('targetPath=>',targetPath)
      
      if (path.extname(req.file.originalname).toLowerCase() === ".png") {
        console.log("9999@@")
        fs.rename(tempPath, targetPath, err => {
            console.log("1111@@")
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .contentType("text/plain")
            .end("File uploaded!");
        });
      } else {
        fs.unlink(tempPath, err => {
            console.log("2222@@")
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .png files are allowed!");
        });
      }
    }
  );

app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;