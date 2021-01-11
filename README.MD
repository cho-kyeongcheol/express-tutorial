
# DB 설정

```

/workspace/board_db
  
 vagrant up

vagrant ssh

sudo service mysql restart

  ```

### file subimt button

``` html
<form method="post" enctype="multipart/form-data" action="/upload">
<input id=file type="file" name="file">
<input type="submit" onclick="fileSubmit()" value="Submit">
<img src="/image.png" />
</form>
```

``` javascript
const  handleError = (err, res) => {
	res
		.status(500)
		.contentType("text/plain")
		.end("Oops! Something went wrong!");
		};
	const  upload = multer({
		dest:  "/path/to/temporary/directory/to/store/uploaded/files"
		// you might also want to set some limits: ttps://github.com/expressjs/multer#limits
		});
	app.post(
		"/upload",
		upload.single("file"  /* name attribute of <file> element in our form */),
	(req, res) => {
		const  tempPath = req.file.path;
		const  targetPath = path.join(__dirname, ./uploads/image.png");
		console.log('tempPath=>',tempPath)
		console.log('targetPath=>',targetPath)
		if (path.extname(req.file.originalname).toLowerCase() === .png") {
		console.log("9999@@")
	fs.rename(tempPath, targetPath, err  => {
		console.log("1111@@")
	if (err) return  handleError(err, res);
		res
		.status(200)
		.contentType("text/plain")
		.end("File uploaded!");
		});
	} else {
		fs.unlink(tempPath, err  => {
		console.log("2222@@")
		if (err) return  handleError(err, res);
		res
		.status(403)
		.contentType("text/plain")
		.end("Only .png files are allowed!");
			});
		}
	}
);
```

#### file 바로넣기
```  html
<form  action="/upload"  method="post"  enctype="multipart/form-data"  id="fileForm">
<input  type="file"  id="fileInput"  name="fileInput">
</form>
<input  type="text"  id="filePath">
```

ajax
``` js
$('#fileInput').on('change', function () {
	var  form = $('#fileForm')[0];
	var  formData = new  FormData(form);
		console.log('form =>', form)
		console.log('formData =>', formData)
	$.ajax({
		type:  'post',
		url:  '/api/upload',
		data:  formData,
		processData:  false,
		contentType:  false,
		success:  function (data) {
		$('#filePath').val(data);
		console.log('data=>',data)
		console.log('success')
		},
		error:  function (error) {
		console.log('error=>', error);
		}
	});
});
```


### api
``` js
router.post('/upload', function (req, res) {
console.log('ajaxfile insert@@')
var  file = req.body;
const  session_id = req.session.user_id;
console.log('req.body =>', file)
console.log('session_id =>' , session_id)
  
const  post_file = PostFile();
  
const  sequelize = getConnection();

console.log('postfile =>', post_file)
  
var  form = new  multiparty.Form({
autoFiles:  false, // 요청이 들어오면 파일을 자동으로 저장할 것인
uploadDir:  'uploads/', // 파일이 저장되는 경로(프로젝트 내의 emp 폴더에 저장됩니다.)
maxFilesSize:  1024 * 1024 * 5  // 허용 파일 사이즈 최대치
});
form.parse(req, async  function (error, fields, files) {
// 파일 전송이 요청되면 이곳으로 온다.
// 에러와 필드 정보, 파일 객체가 넘어온다.
var  path = files.fileInput[0].path;
console.log('files =>' , files)
console.log("path : ",path);
res.send(path); // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.
const  t = await  sequelize.transaction();
  
var  str = path.substring(8,1000);
console.log('@@str@@ =>', str)
  
// try{
// const post_files = await post_file.create({
// user_id: 'aaa',
// filepath: 'path',
// filename: 'str'
// }, { transaction: t })
// } catch (error) {
// await t.rollback();
// console.log('error =>', error)
// res.json({ 'result': 'fail' })
// }
// res.json({ 'result': 'success' })
  
  
const  post_files = await  post_file.create({
	user_id:  session_id,
	filepath:  path,
	filename:  str
})
console.log('post_files=>',post_files)
});
console.log("path222@@@ : ",path);
// const sequelize = getConnection(); 	
});

```