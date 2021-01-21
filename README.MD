
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

### ssh에서 DB조회
```
mysql -u root -p (password:password)


### mysql 접속 오류
1.  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password:  **NO**)  
    `mysql -u [user name] -p [your password]`  입력  
    ex. mysql -u root -p 1234
    
2.  ERROR 1045 (28000): Access denied for user 'root'@'localhost' (using password:  **YES**)  
    mysql>  `use mysql`  
    mysql>  `update user set password=password('바꿀 비밀번호') where user='사용자 이름';`  
    mysql>  `flush privileges;`
    
**1번의 경우** 비밀번호를 입력하지 않아서 그렇고, **2번의 경우** 비밀번호가 틀린 경우이므로 (진짜 비밀번호를 모르겠으면) 새 비밀번호로 설정하고 새로고침[flush] 한다.

-> DB접속
-> show databases;
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
### 리스트에서 삭제할때 id값
``` js
function  updateTodo(id) {
	// var inputTodo = document.getElementById('#inputTodo');
	var  inputTodo = $('#inputTodo_' + id).val();
	console.log('id = ', id)
	console.log("inputTodo => ", inputTodo)
		$.post("/api/vi/board/update/", {
			id:  id,
			content:  inputTodo
			}).done(function (data) {
				if (data.result === 'fail') {
					Swal.fire({
					icon:  'error',
					title:  '수정',
					text:  '실패!'
					})
				} else {
					Swal.fire({
					icon:  'success',
					title:  '수정',
					text:  '성공!'
					})
				}
		})
	return  id;
}
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
	readUpload() // read로 파일넣고 바로출력
});
```
#### readUplod
``` js
function  readUpload() {
	$.post("/api/vi/upload/read/", {
	// pass
		}).done(function (data) {
			var  post_file = data.data;
			const  content = `
				<% if(img_src != undefined) { %>
				<img src="<%= src %>" style="width: 200px; height: 300px;"/>
				<% } %>
				  
				<% if(img_src == undefined) { %>
				<div>이미지를 선택하세요</div>
				<% } %>
			`
	$('#imageload').prepend(content);
	})
}
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

### 게시판 List 형태 한줄 지우기
``` js
$('#row_'  + id).remove();
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

###  raw : true 
```
{ raw: true }

`findOne()` 및 `findAll()`에서 json형태로 보거나 가공하고 싶을 때 사용합니다. sequelize 쿼리문 안에 아래와 같이 작성합니다.
```

#### 현재 URL 서버로 넘기기

``` JS 
var  url = require('url');



var parsedObject = req.url;
var sub_url = parsedObject.substring(19, 30);
console.log('parsedObject=>', parsedObject); // 현재 url 객체 정보 출력
console.log('sub_url=>', sub_url); // bbs_eq url 객체 정보 출력
```

### html안에 text값 가져오기
``` js
var  bbs_eq = $("#bbs_eq").html();
or
var  bbs_eq = document.getElementById('bbs_eq').innerHTML;
```

### id값이 바뀔때마다 (파라미터 넣어주기)
``` html
<td id="idx_${el.idx}">
<button onclick="rowSelect(${el.idx})">밑에 댓글쓰기</button>
```

### id값이 바뀔때마다 (파라미터 가져오기, text값 빼서 쓰기)
``` js 
function  rowSelect(idx){
	console.log('idx=>',idx)
	var  idxNo = $("#idx_"+idx).html();
	console.log('idxNo(up_idx사용할때)) => ',idxNo)
}
```

### board_list 에서 board_view로 넘어갈때
```
<a href="/board_view?${el.bbs_eq}"> ${el.title} </a>

title을 누르면 bbs_eq값을 뒤에 붙혀서 id값을 뒤에 물고감
```

### javascript 글로벌 변수로 사용하기(MyApp에 담아서 다른함수에서 호출)
``` js
var MyApp = {}; // Globally scoped object

function foo(){
    MyApp.color = 'green';
}

function bar(){
    alert(MyApp.color); // Alerts 'green'
} 

```

### TABLE에서 특정 td값 숨기기
``` CSS
td:nth-of-type(5) { display: none; }
```

### button 에 다중 파라미터 넣기
``` html,
<button onclck="rowSelect(${el.idx},${el.p_id})">밑에 댓글쓰기</button>

function rowSelect(idx,p_id){
}
```

#### REPLY api
#### reply/insert
``` js
router.post('/vi/reply/insert', async  function (req, res, next) 
	const  session_id = req.session.user_id;
	const  replyTitle = req.body.replyTitle;
	const  replyContent = req.body.replyContent;
	const  bbs_eq = req.body.bbs_eq;	
	if (replyTitle === '') {
	res.json({ 'result':  'fail' })
	}
	if (replyContent === '') {
	res.json({ 'result':  'fail' })
	}	  
	// Model Basics
	const  todos = Todos();	  
		try {
		const  todo = await  todos.create({
		user_eq:  session_id,
		title:  replyTitle,
		content:  replyContent,
		board_type:  'reply',
		parent_id:  bbs_eq
		})
		const  data = todo.get({ plain:  true })
			res.json({ 'result':  'success', 'datas':  data })
		} catch (e) {
		console.log('실패!!');
	res.json({ 'result':  'fail' })
	}
});
```

#### insert/read
``` js
router.post('/vi/reply/read', async  function (req, res, next) {
	const  session_id = req.session.user_id;
	const  bbs_eq = req.body.bbs_eq;	
	const  todos = Todos();
	const  todo_list = await  todos.findAll({
		where: {
		del_yn:  'N',
		parent_id:bbs_eq
		},
		raw:  true
	});	
	res.json({ 'result':  'success', 'reply':  todo_list })
})
```


### SEARCH
### function (ajax)
``` js
function  search() {
	for(var  i=0; i<9999;i++){
	$('#row_'+i).remove();
	}
	search2()  //모두 지우고 다시 실행
}

  
function  search2() {
	var  searchText = $('#searchText').val();
	var  searchType = $('#searchType').val();
	console.log('searchText=>',searchText)
	console.log('searchType=>',searchType)
		$.post("/api/vi/board/search/", {
			searchText:  searchText,
			searchType:  searchType
			}).done(function (data) {
			console.log('data=>',data)
			var  todos = data.data;
			console.log('todos = ', todos);
			todos.forEach(el  => {
			const  content = `
				<tr id="row_${el.bbs_eq}">
				<td>
					<span id="bbs_eq">${el.bbs_eq}</span>
				</td>
				<td>
					<a href="/board_view?bbs_eq=${el.bbs_eq}"> ${el.title} </a>
				</td>
				<td>
					${el.user_eq}
				</td>
				<td>
					${el.content}
				</td>
				<td>
					${el.board_type}
				</td>
				<td>
					${el.count}
				</td>
				</tr>
			`
			$('#todo_list').append(content);
		});
	})
}
```

# ISSUE
###  Validation error
``
SequelizeUniqueConstraintError: Validation error
    at Query.formatError (C:\Users\dev\workspace\express-tutorial\node_modules\sequelize\lib\dialects\mysql\query.js:218:16)

DB or model 속성값이랑 컬럼이름 확인
```

####  DB수정 이슈
```
디비 컬럼명을 많이 수정하게 되었다.
(node:12160) UnhandledPromiseRejectionWarning: SequelizeDatabaseError: Unknown column 'todos.id' in 'order clause'
    at Query.formatError (C:\Users\dev\workspace\express-tutorial\node_modules\sequelize\lib\dialects\mysql\query.js:239:16)
```

#### 해결방법
```
connection.js -> model 과 DB컬럼명을 맞춰준다
그래도 없다면 에러난 컬럼명을 찾아 api.js or render.js 에 값이 들어가는 부분을 찾아 컬럼명 확인
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

### net::ERR_CONNECTION_RESET 200 (OK) 
```  js
read를 할때 post 메서드 사용시 에러가 가끔나옴

해결 : list 출력할땐 post 매서드를 get매서드로 바꿔준다.
view 페이지에 bbs_eq값 구하기

(ajax안에서 data로 bbs_eq값을 넘겨준다)
var  bbs_eq = $("#bbs_eq").html();
	data: {
	bbs_eq:  bbs_eq
	}

const querydata = req.query.data.bbs_eq;
(ajax로 넘어온데이값을 빼서 parent_id:  querydata 넣어준다)
```
### MYSQL @ 
```  
CREATE PROCEDURE prc_test ()
BEGIN
    DECLARE var2 INT DEFAULT 1;
    SET var2 = var2 + 1;
    SET @var2 = @var2 + 1;
    SELECT  var2, @var2;
END;

SET @var2 = 1;

CALL prc_test();

var2  @var2
---   ---
2     2


CALL prc_test();

var2  @var2
---   ---
2     3


CALL prc_test();

var2  @var2
---   ---
2     4
```
### MYSQL 버전확인
```
select version();
```

### reply insert value (table row)
``` js
var  table = document.getElementById("todo_list2");
var  totalRowCount = table.rows.length; //row 개수
  
var  select = document.getElementById('row_'+p_id);
var  rowIndex = select.rowIndex; //row index 값

```