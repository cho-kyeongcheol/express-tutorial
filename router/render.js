var express = require('express');
var router = express.Router();

const { getConnection, Users, UsersLogin } = require('../connection')

router.get('/', async (req, res) => {

    console.log('req.session = ', req.session);

    const user_id = req.session.user_id;
    var context = {};

    if (user_id) {
        const users = Users();

        const user = await users.findAll({
            where: {
              id: user_id
            },
            raw: true
        });

        const user_list = await users.findAll({
            raw: true
        });

        context.user = user[0]
        context.user_list = user_list
    } else {
        context.user = undefined
        context.user_list = undefined
    }

    res.render('index', context);
})

router.get('/regist', (req, res) => {
    var context = {};
    res.render('regist', context);
})

router.get('/login', (req, res) => {
    var context = {};
    res.render('login', context);   
})

router.get('/test', (req, res) => {
    var context = {};
    res.render('test', context);
})

module.exports = router;