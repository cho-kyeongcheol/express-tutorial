var express = require('express');
var router = express.Router();

const { getConnection, Users, UsersLogin, Todos } = require('../connection')

router.get('/test', async (req, res) => {
    var context = {};
    res.render('test', context); 
})

router.get('/usermidify', async (req, res) => {
    var context = {};
    res.render('usermidify', context); 
})



router.get('/', async (req, res) => {

    console.log('req.session = ', req.session);
    
    const user_id = req.session.user_id;
    var context = {};

    if (user_id) {
        const users = Users();

        const todos = Todos();

        const user = await users.findAll({
            where: {
                id: user_id
            },
            raw: true
        });

        const user_list = await users.findAll({
            raw: true
        });

        const todo = await todos.findAll({
            where: {
                user_id : user_id,
              },              
            raw: true
        });
        const todo_list = await todos.findAll({
            where: {
                del_yn: 'N'
            },
            order: [
                ['id', 'DESC']               
            ],
            raw: true
        });

        context.user = user[0]
        context.user_list = user_list
        context.todo = todo[0]
        context.todo_list = todo_list
    } else {
        context.user = undefined
        context.user_list = undefined
        context.todo = undefined
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