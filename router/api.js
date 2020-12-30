var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const { getConnection, Users, UsersLogin, Todos } = require('../connection')

router.post('/vi/board/update', async function (req, res, next) {

  console.log('req.body = ', req.body);
  const inputText = req.body.content;
  const id = req.body.id;
  let date_ob = new Date();

  const todos = Todos();

  console.log("@@inputText =>", inputText)
  console.log("date_ob=>" , date_ob)

  try {
    await todos.update({ content: inputText, update_at: date_ob }, {
      where: {
        id: id
      }
    });
  } catch (e) {
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })
})


router.post('/vi/board/read', async function (req, res, next) {

  const session_id = req.session.user_id;
  const todos = Todos();

  const todo_list = await todos.findAll({
    offset: 0,
    limit : 5,
    where: {
      del_yn: 'N',
      user_id: session_id
    },
    order: [
      ['id', 'DESC']
    ],
    raw: true
  });

  console.log('hello')

  res.json({ 'result': 'success', 'data': todo_list })
})

router.post('/vi/board/delete', async function (req, res, next) {

  console.log('req.body = ', req.body);

  const session_id = req.session.user_id;
  const id = req.body.id;
  let date_ob = new Date();

  const todos = Todos();  

  try {
    await todos.update({ del_yn: "Y" , delete_at: date_ob}, {
      where: {
        id: id,
        user_id: session_id
      }
    });
  } catch (e) {
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })
})


router.post('/v1/board/insert', async function (req, res, next) {

  console.log('req.body = ', req.body);

  const session_id = req.session.user_id;
  const inputText = req.body.inputText;

  console.log('session_id = ', session_id);
  console.log('inputText = ', inputText);

  if (inputText === '') {
    res.json({ 'result': 'fail' })
  }

  // Model Basics
  const todos = Todos();

  try {
    const todo = await todos.create({
      content: inputText,
      user_id: session_id
    })
    console.log('todo => ', todo)

    const data = todo.get({ plain: true })
    res.json({ 'result': 'success', 'data': data })
  } catch (e) {
    res.json({ 'result': 'fail' })
  }
});


router.post('/v1/regist', async function (req, res, next) {

  console.log('req.body = ', req.body);

  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;
  var hash = crypto.createHash('md5').update(inputPw).digest('hex');

  console.log('inputName = ', inputName);
  console.log('hash#inputPw = ', hash);

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

  // Transaction
  const t = await sequelize.transaction();

  try {
    const user = await users.create({
      username: inputName,
      password: hash
    }, { transaction: t });

    const user_login = await users_login.create({
      user_id: user.id
    }, { transaction: t });

    await t.commit();

  } catch (error) {
    await t.rollback();
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
  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;
  var hash = crypto.createHash('md5').update(inputPw).digest('hex');
  const session_id = req.session.user_id;
  const session = req.session

  console.log('inputName = ', inputName);
  console.log('inputPw = ', hash);
  console.log("session_id = ", session_id)
  console.log("session = ", session)

  if (inputName === '') {
    res.json({ 'result': 'fail' })
  }
  if (hash === '') {
    res.json({ 'result': 'fail' })
  }

  const users = Users();

  const users_login = UsersLogin();

  const user = await users.findAll({
    where: {
      username: inputName,
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
    req.session.user_id = user[0].id;
    res.json({ 'result': 'success' })
  }
});

module.exports = router;