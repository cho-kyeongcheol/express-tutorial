var express = require('express');
var router = express.Router();
var crypto = require('crypto');

const { getConnection, Users, UsersLogin, Todos } = require('../connection')


router.post('/vi/board/delete', async function (req, res, next) {

  const sequelize = getConnection();

  const todos = Todos();

  const users_login = UsersLogin();

  const session = req.session;
  console.log('@@session =>', session)

  const session_id = req.session.user_id;

  console.log('session_id =>', session_id)

  // const board_id = req.session.board_id;

  // console.log('board_id =>', board_id)

  const user_login = await users_login.create({
    user_id: session_id
  })

  await todos.destroy({
    where: {
      id: user_login.user_id
    }
  });

})


router.post('/v1/board/insert', async function (req, res, next) {

  console.log('req.body = ', req.body);

  var inputText = req.body.inputText;
  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;


  console.log('inputText = ', inputText);

  if (inputText === '') {
    res.json({ 'result': 'fail' })
  }


  const sequelize = getConnection();

  // Model Basics
  const users_login = UsersLogin();

  // Model Basics
  const todos = Todos();

  // Transaction
  const t = await sequelize.transaction();

  const session_id = req.session.user_id;

  try {
    const user_login = await users_login.create({
      user_id: session_id
    })

    const todo = await todos.create({
      content: inputText,
      user_id: user_login.user_id
    });
  }
  catch (error) {
    await t.rollback();
    res.json({ 'result': 'fail' })
  }

  res.json({ 'result': 'success' })

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

  var inputName = req.body.inputName;
  var inputPw = req.body.inputPw;
  var hash = crypto.createHash('md5').update(inputPw).digest('hex');

  console.log('inputName = ', inputName);
  console.log('inputPw = ', hash);

  if (inputName === '') {
    res.json({ 'result': 'fail' })
  }
  if (hash === '') {
    res.json({ 'result': 'fail' })
  }

  const users = Users();

  const user = await users.findAll({
    where: {
      username: inputName,
      password: hash
    },
    raw: true
  });

  console.log('user => ', user)
  console.log('user.length => ', user.length)

  if (user.length === 0) {
    res.json({ 'result': 'fail' })
  } else {
    // session up
    req.session.user_id = user[0].id;
    res.json({ 'result': 'success' })
  }
});




module.exports = router;