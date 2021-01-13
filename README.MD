
# DB 설정

### 로컬DB
```
host : 192.168.33.80
port : 3306
id : dev
pw : password
```


``` RUBY
# -*- mode: ruby -*-
# vi: set ft=ruby :

MEMORY = 1024
CPU_COUNT = 1

Vagrant.configure("2") do |config|
	config.vm.box = "ubuntu/xenial64"
	config.vm.network "private_network", ip: "192.168.33.80"
	# config.vm.network "forwarded_port", guest: 80, host: 8080
	config.vm.synced_folder ".", "/vagrant", disabled: true
	config.vm.provider "virtualbox" do |vb|
	vb.customize ["modifyvm", :id, "--memory", MEMORY.to_s]
	vb.customize ["modifyvm", :id, "--cpus", CPU_COUNT.to_s]
	end
end

```
### DB 처음세팅


```
 mysql 서비스 확인
- sudo service mysql status
- 
외부접속 허용
- sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
	bind-address          = 0.0.0.0
	or
	 bind-address          = 127.0.0.1
	 
 mysql 서비스 재실행
-sudo service mysql restart

# 권한 부여
mysql -u root -p
0000

grant all privileges on *.* to 'dev'@'%' identified by 'password' with grant option;
flush privileges;
```



### DB구축된 상태
```
/workspace/board_db
  
 서버실행
- vagrant up
서버접속
- vagrant ssh
mysql 재시작
- sudo service mysql restart
  ```

### 카카오 레포지토리 변경
```
sudo vi /etc/apt/sources.list

:%s/archive.ubuntu.com/ftp.daum.net/g
:%s/security.ubuntu.com/ftp.daum.net/g 
```


### file subimt button

``` html
<form method="post" enctype="multipart/form-data" action="/upload">
<input id=file type="file" name="file">
<input type="submit" onclick="fileSubmit()" value="Submit">
<img src="/image.png" />
</form>
```

``` js
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

## file 바로넣기
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
// transaction 사용(transaction 에러로 잠시 주석처리중)
  
  
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

### 회원가입 트랜잭션처리
``` js
try {
const user = await users.create({
username: inputName,
password: hash,
user_id: user_Id,
email: inputEmail
}, { transaction: t });

 const user_login = await users_login.create({
user_id: user.id
}, { transaction: t });

await t.commit();

} catch (error) {
await t.rollback();
res.json({ 'result': 'fail' })
}
```

###  컬럼 is null 
```
connection 안에 allowNull 확인
```

#### TypeError: Cannot read property 'substring' of null
``` js 
file이 현재 없어서 router.get('/usermodify' 에서 에러 

/render.js

if(post/file[0].dataValues.filename != null) {
	context.user = user[0]
	context.img_src = postfile[0].dataValues.filepath
	var  str = context.img_src.substring(8, 1000);
	context.src = str
else{
	context.user = user[0]
	context.img_src = postfile[0].dataValues.filepath
	context.post_file = undefined
}
```

####  usermodify.ejs
``` js
<% if(img_src != undefined) { %>
	<img  src="<%= src %>"  style="width: 200px; height: 300px;"/>
<% } %>
  
<% if(img_src == undefined) { %>
	<div>이미지를 선택하세요</div>
<% } %>

```
