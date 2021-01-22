var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var multer = require('multer');
const sequelize = require("sequelize");


const Op = sequelize.Op;
const { QueryTypes } = require('sequelize');

var fs = require('fs');
var multiparty = require('multiparty');


const { getConnection, Users, UsersLogin, Todos, PostFile, Reply } = require('../connection');
const { path } = require('../server');

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/vi/reply/delete', async function (req, res, next) {
  console.log('req.body = ', req.body); 
  const idx = req.body.idx;

  const todos = Todos();

  // await todos.sequelize.query("update todos set del_yn = 'Y' WHERE idx = '"+idx+"' ");
  // await todos.sequelize.query("update todos set idx = idx + 1 WHERE idx >= "+idx+" order by idx DESC");

  try {
    await todos.update({ 
      del_yn: 'Y',       
    }, {
      where: {
        idx: idx
      }
    });
    res.json({ 'result': 'success' })
  } catch (e) {
    res.json({ 'result': 'fail'})
  } 

})

router.get('/vi/reply/read', async function (req, res, next) {
  console.log('@@reply/read@@ ')
  console.log('req.body = ', req.body);  
  const session_id = req.session.user_id;  
  const param = req.params;
  const query = req.query;
  const querydata = req.query.data.bbs_eq;
  console.log('param=>',param)
  console.log('query=>',query)
  console.log('querydata=>',querydata)
  
  const todos = Todos(); 

  console.log('session_id =.>', session_id)
  
  // const reply_list = await todos.sequelize.query("SELECT * FROM `todos` where del_yn = 'N' and bbs_eq = '"+querydata+"'  ",
  //  {
  //    type: QueryTypes.SELECT 
  // });

  const reply_list = await todos.findAll({    
    where: {
      del_yn: 'N',
      bbs_eq: querydata      
    },
    raw: true
  });

  console.log('hello')
  res.json({ 'result': 'success', 'data': reply_list })
})

router.post('/vi/reply/insert', async function (req, res, next) {
  console.log('req.body = ', req.body);
  console.log('REPLYINSERT1');
  const session_id = req.session.user_id;
  const replyTitle = req.body.replyTitle;
  const replyContent = req.body.replyContent;
  const bbs_eq = req.body.bbs_eq;
  const tableRow = req.body.tableRow;  
  const up_idx = req.body.up_idx;
  let idx_no = req.body.idx_no;
  let levels = req.body.levels;

  if(levels === undefined ){
    levels = 0
  } 

  if(idx_no === undefined ){
    idx_no = 9999
  } 
  
  var re_levels = parseInt(levels) // 문자열로 들어온 levels 를 int형으로 바꾸기


  console.log('session_id = ', session_id);
  console.log('replyTitle = ', replyTitle);
  console.log('replyContent = ', replyContent);
  console.log('bbs_eq = ', bbs_eq);
  console.log('tableRow = ', tableRow);  
  console.log('up_idx = ', up_idx);
  console.log('levels = ', levels);
  console.log('re_levels = ', re_levels);
  console.log('idx_no = ', idx_no);  

  if (replyTitle === '') {
    res.json({ 'result': 'fail' })
  } 
  if (replyContent === '') {
    res.json({ 'result': 'fail' })
  } 

  const todos = Todos(); 

  console.log('todo@@@sss =>', todos)   

  // await todos.sequelize.query("update todos set idx = idx + 1 WHERE idx >= "+idx_no+" order by idx DESC");


  // console.log('update 성공!')

  // const todo = await todos.create({
  //   idx : idx_no,
  //   p_id: tableRow,
  //   title: replyTitle,
  //   content: replyContent,      
  //   bbs_eq: bbs_eq,
  //   user_eq: session_id,
  //   up_idx: up_idx,
  //   board_type: 'reply',
  //   levels: 1 + re_levels   
  // })
  // console.log('@@@@todo = ', todo); 
  

  // await todos.sequelize.query("update todos set idx = idx + 1 WHERE idx >= "+idx_no+" order by idx DESC");
   

  try {  
    await todos.sequelize.query("update todos set idx = idx + 1 WHERE idx >= "+idx_no+" order by idx DESC");
    
    const todo = await todos.create({
      idx : idx_no,
      p_id: tableRow,
      title: replyTitle,
      content: replyContent,      
      bbs_eq: bbs_eq,
      user_eq: session_id,
      up_idx: up_idx,
      board_type: 'reply',
      levels: 1 + re_levels   
    })
    console.log("성공!!")
    const data = todo.get({ plain: true })
    res.json({ 'result': 'success', 'datas': data })
  } catch (e) {
    console.log('실패!!');
    res.json({ 'result': 'fail' })
  }

});



router.get('/vi/upload/board/read', async function (req, res, next) {
  const postfile = PostFile();  
  const session_id = req.session.user_id;
  console.log('@@@upload/read', postfile)
  
  const post_file = await postfile.findAll({
    user_id : session_id,
    file_type: 'attach'
  })
  console.log('@@@upload/read 뒷부분', postfile)
  
  res.json({ 'result': 'success', 'data': post_file })
  })

router.post('/board/upload', function (req, res) {
  console.log('ajaxfile insert@@')
  var file = req.body;
  const session_id = req.session.user_id;
  console.log('req.body =>', file)
  console.log('session_id =>', session_id)
  
  const post_file = PostFile();

  const sequelize = getConnection();

  console.log('postfile =>', post_file)

  var form = new multiparty.Form({
    autoFiles: false, // 요청이 들어오면 파일을 자동으로 저장할 것인가
    uploadDir: 'uploads/', // 파일이 저장되는 경로(프로젝트 내의 temp 폴더에 저장됩니다.)
    maxFilesSize: 1024 * 1024 * 5 // 허용 파일 사이즈 최대치
  });

  form.parse(req, async function (error, fields, files) {
    // 파일 전송이 요청되면 이곳으로 온다.
    // 에러와 필드 정보, 파일 객체가 넘어온다.
    var path = files.fileInput[0].path;
    console.log('files =>', files)
    console.log("path : ", path);
    res.send(path); // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.  

    // const t = await sequelize.transaction();

    var str = path.substring(8, 1000);
    console.log('@@str@@ =>', str)

    try {
       const post_files = await post_file.create({  
          target_id: session_id,
          file_type: 'attach',
          filepath: path,
          filename: str
        })


      // await post_file.update({ filepath: path, filename: str , file_type: 'attach'}, {
      //   where: {
      //     post_id: session_id
      //   }
      // });
    } catch (e) {
      res.json({ 'result': 'fail' })
    }
    console.log('post_files=>', post_file)
  });
});


router.post('/vi/upload/read', async function (req, res, next) {
  const postfile = PostFile();  
  const session_id = req.session.user_id;
  console.log('@@@upload/read', postfile)
  
  const post_file = await postfile.findAll({
    user_id : session_id
  })
  console.log('@@@upload/read 뒷부분', postfile)
  
  res.json({ 'result': 'success', 'data': post_file })
  })

router.post('/upload', function (req, res) {
  console.log('ajaxfile insert@@')
  var file = req.body;
  const session_id = req.session.user_id;
  console.log('req.body =>', file)
  console.log('session_id =>', session_id)
  
  const post_file = PostFile();
00
  const sequelize = getConnection();

  console.log('postfile =>', post_file)

  var form = new multiparty.Form({
    autoFiles: false, // 요청이 들어오면 파일을 자동으로 저장할 것인가
    uploadDir: 'uploads/', // 파일이 저장되는 경로(프로젝트 내의 temp 폴더에 저장됩니다.)
    maxFilesSize: 1024 * 1024 * 5 // 허용 파일 사이즈 최대치
  });

  form.parse(req, async function (error, fields, files) {
    // 파일 전송이 요청되면 이곳으로 온다.
    // 에러와 필드 정보, 파일 객체가 넘어온다.
    var path = files.fileInput[0].path;
    console.log('files =>', files)
    console.log("path : ", path);
    res.send(path); // 파일과 예외 처리를 한 뒤 브라우저로 응답해준다.  

    const t = await sequelize.transaction();

    var str = path.substring(8, 1000);
    console.log('@@str@@ =>', str)

    try {
      await post_file.update({ filepath: path, filename: str }, {
        where: {
          target_id: session_id
        }
      });
    } catch (e) {
      res.json({ 'result': 'fail' })
    }
    console.log('post_files=>', post_file)
  });
});


router.post('/vi/user/update', async function (req, res, next) {
  console.log('req.body =>', req.body)
  const inputId = req.body.id;
  const inputUsername = req.body.userName;
  const inputPw = req.body.password;
  const inputEmail = req.body.email;  
  const session_id = req.session.user_id;
  const users = Users();

  try {
    await users.update({ user_id: inputId, username: inputUsername, password: inputPw, email: inputEmail }, {
      where: {
        user_eq: session_id
      }
    });
  } catch (e) {
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })

})

router.post('/vi/board/update', async function (req, res, next) {

  console.log('req.body = ', req.body);
  const inputTitle = req.body.inputTitle;
  const inputText = req.body.inputText;
  const board_select = req.body.board_select;
  const id = req.body.bbs_eq;
  let date_ob = new Date();

  const todos = Todos();

  console.log("@@inputTitle =>", inputTitle)
  console.log("@@inputText =>", inputText)
  console.log("@@board_select =>", board_select)
  console.log("date_ob=>", date_ob)

  try {
    await todos.update({ title: inputTitle, content: inputText, board_tpye: board_select, update_at: date_ob }, {
      where: {
        idx: id
      }
    });
  } catch (e) {
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })
})

router.post('/vi/board/search', async function (req, res, next) {
  console.log('req.body = ', req.body);
  const searchText = req.body.searchText
  const searchType = req.body.searchType

  console.log('searchText=>', searchText)
  console.log('board_select=>', searchType)
  
  const todos = Todos();
  
  const todo_list = await todos.findAll({    
    where: {
        content : {
        [Op.like]: "%" + searchText + "%"
    },
      del_yn: 'N',
      parent_id: null      
    },
    order: [
      ['bbs_eq', 'DESC']
    ],
    raw: true
  });
  console.log('search hello')

  res.json({ 'result': 'success', 'data': todo_list })
})


router.get('/vi/board/read', async function (req, res, next) {

  const session_id = req.session.user_id;
  const todos = Todos();
  console.log('session_id =.>', session_id)
  const todo_list = await todos.findAll({    
    offset: 0,
    limit: 5,
    where: {
      del_yn: 'N',
      p_id:0,      
      levels:0     
    },
    order: [
      ['idx', 'DESC']
    ],
    raw: true
  });

  console.log('hello')

  res.json({ 'result': 'success', 'data': todo_list })
})


router.post('/vi/board/delete', async function (req, res, next) {  
  console.log('req.body = ', req.body);

  const session_id = req.session.user_id;  
  const bbs_eq = req.body.bbs_eq;
  console.log('bbs_eq =>', bbs_eq)
  let date_ob = new Date();

  const todos = Todos();

  try {
    await todos.update({ del_yn: "Y", delete_at: date_ob }, {
      where: {
        bbs_eq: bbs_eq        
      }
    });
  } catch (e) {
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })
})


router.post('/v1/board/insert', async function (req, res, next) {
  console.log('req.body = ', req.body);
  console.log('BOARDINSERT1');
  const session_id = req.session.user_id;
  const inputTitle = req.body.inputTitle;
  const inputText = req.body.inputText;
  const board_type = req.body.board_type;

  console.log('session_id = ', session_id);
  console.log('inputTitle = ', inputTitle);
  console.log('inputText = ', inputText);
  console.log('board_type = ', board_type);
  
  if (inputText === '') {
    res.json({ 'result': 'fail' })
  }

  if (inputTitle === '') {
    res.json({ 'result': 'fail' })
  }

  // Model Basics
  const todos = Todos();
  const post_file = PostFile();

  console.log('BOARDINSERT');   

  try {
    const todo = await todos.create({
      user_eq: session_id,
      title: inputTitle,
      content: inputText,
      board_type: board_type,
      p_id:0,
      levels:0          
    })

    // await post_files.update({ del_yn: "Y", delete_at: date_ob }, {
    //   where: {
    //     bbs_eq: id,
    //     user_eq: session_id
    //   }
    // });
    // const post_files = await post_file.create({      
    //   file_type: 'attach'
    // })

    console.log('todo => ', todo)

    const data = todo.get({ plain: true })
    res.json({ 'result': 'success', 'data': data })
  } catch (e) {
    console.log('실패!!');
    res.json({ 'result': 'fail' })
  }

});


router.post('/v1/regist', async function (req, res, next) {

  console.log('req.body = ', req.body);
  console.log("@@@@REGIST CLICK!!!@@##")

  var user_Id = req.body.user_Id;
  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;
  var inputEmail = req.body.inputEmail;
  var hash = crypto.createHash('md5').update(inputPw).digest('hex');

  console.log('inputName = ', inputName);
  console.log('hash#inputPw = ', hash);
  console.log('inputName = ', user_Id);
  console.log('inputEmail = ', inputEmail);

  if (user_Id === '') {
    res.json({ 'result': 'fail' })
  }
  if (inputName === '') {
    res.json({ 'result': 'fail' })
  }
  if (hash === '') {
    res.json({ 'result': 'fail' })
  }

  const sequelize = getConnection();

  // Model Basics
  const users = Users();

  // Model Basics
  const users_login = UsersLogin();

  // Model Basics
  const post_file = PostFile();
  
  // Transaction
  const t = await sequelize.transaction();


  try {
    const user = await users.create({
      user_id: user_Id,
      username: inputName,
      password: hash,
      email: inputEmail
    });
    const user_login = await users_login.create({
      user_id: user.user_eq
    });
    const post_files = await post_file.create({
      target_id: user.user_eq,
      file_type: 'profile'
    })
  } catch (e) {
    res.json({ 'result': 'fail' })
  }
  res.json({ 'result': 'success' })
});


router.post('/v1/logout', async function (req, res, next) {

  var inputName = req.body.inputName;
  console.log('@@inputName = ', inputName);
  console.log("req.session:", req.session)
  req.session.destroy(function () {
    req.session;
  });

  console.log("req.session:", req.session)
  res.json({ 'result': 'success' })

});

router.post('/v1/login', async function (req, res, next) {
  console.log('req.body = ', req.body);

  const sequelize = getConnection();
  var inputId = req.body.inputId;
  var inputPw = req.body.inputPw;
  var hash = crypto.createHash('md5').update(inputPw).digest('hex');
  

  console.log('inputName = ', inputId);
  console.log('inputPw = ', hash);
 

  if (inputId === '') {
    res.json({ 'result': 'fail' })
  }
  if (hash === '') {
    res.json({ 'result': 'fail' })
  }

  const users = Users();

  const users_login = UsersLogin();

  const user = await users.findAll({
    where: {
      user_id: inputId,
      password: hash
    },
    raw: true
  })

  console.log('user => ', user)
  console.log('user.length => ', user.length)

  if (user.length === 0) {
    await users_login.update({ login_cnt: sequelize.literal('login_cnt + 1') }, {
      where: {
        user_id: 174
      }
    });
    res.json({ 'result': 'fail' })
  } else {
    // session up
    console.log('성공@@')
    req.session.user_id = user[0].user_eq;
    console.log('req.session.user_id@@=>',req.session.user_id)
    res.json({ 'result': 'success' })
  }
});



module.exports = router;