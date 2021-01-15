var express = require('express');
var router = express.Router();
const path = require("path");
var url = require('url');


const { getConnection, Users, UsersLogin, Todos, PostFile } = require('../connection')

router.get('/test', async (req, res) => {
    var context = {};
    res.render('test', context);
})


router.get('/usermodify', async (req, res) => {
    // var context = { "qqq": "aaaa" };

    const session_id = req.session.user_id;
    var context = {};

    const post_file = PostFile();
    const users = Users();

    const postfile = await post_file.findAll({
        where: { target_id: session_id }
    });
    const user = await users.findAll({
        where: {
            user_eq: session_id
        },
        raw: true
    });
    if (postfile[0].dataValues.filename != null) {
        context.user = user[0]
        context.img_src = postfile[0].dataValues.filepath
        var str = context.img_src.substring(8, 1000);
        context.src = str

        console.log('==1=1=1=1postfile=1=1===', postfile)
        console.log('#@#@#user@#@# =>', user)
        console.log('==1=1=1=1=1=1===', postfile[0].dataValues.filepath)
        console.log('@@@FILENAME', postfile[0].dataValues.filename)
        console.log('@@str@@ =>', str)

    } else {
        console.log('@@!!##undefined')
        context.user = user[0]
        context.img_src = postfile[0].dataValues.filepath
        context.post_file = undefined
        console.log('@@#!#!#!#!qwqwqwqw', context.post_file)

    }

    // console.log("contextcontext",context)    
    res.render('usermodify', context);
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
                user_eq: user_id
            },
            raw: true
        });

        const user_list = await users.findAll({
            raw: true
        });

        const todo = await todos.findAll({
            where: {
                user_eq: user_id,
            },
            raw: true
        });
        const todo_list = await todos.findAll({
            where: {
                del_yn: 'N'
            },
            order: [
                ['bbs_eq', 'DESC']
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
        context.todo_list = undefined
    }
    res.render('index', context);
})


router.get('/board_write', async (req, res) => {
    const user_id = req.session.user_id;
    var context = {};

    if (user_id) {
        const users = Users();

        const post_file = PostFile();

        const postfile = await post_file.findAll({
            where: { target_id: user_id }
        });

        const user = await users.findAll({
            where: {
                user_eq: user_id
            },
            raw: true
        });


        if (postfile[0].dataValues.filename != null) {
            context.user = user[0]
            context.img_src = postfile[0].dataValues.filepath
            var str = context.img_src.substring(8, 1000);
            context.src = str

            console.log('==1=1=1=1postfile=1=1===', postfile)
            console.log('#@#@#user@#@# =>', user)
            console.log('==1=1=1=1=1=1===', postfile[0].dataValues.filepath)
            console.log('@@@FILENAME', postfile[0].dataValues.filename)
            console.log('@@str@@ =>', str)

            context.user = user[0]
        } else {
            console.log('@@!!##undefined')
            context.user = user[0]
            context.img_src = postfile[0].dataValues.filepath
            context.post_file = undefined
            console.log('@@#!#!#!#!qwqwqwqw', context.post_file)

        }





    } else {
        context.user = undefined
    }

    res.render('board/board_write', context);
})

router.get('/board_view', async (req, res) => {
    const user_id = req.session.user_id;

    var parsedObject = req.url;
    var sub_url = parsedObject.substring(19, 30);
    console.log('parsedObject=>', parsedObject); // 현재 url 객체 정보 출력
    console.log('sub_url=>', sub_url); // bbs_eq url 객체 정보 출력

    var context = {};

    if (user_id) {
        const users = Users();

        const todos = Todos();

        const post_file = PostFile();

        const user = await users.findAll({
            where: {
                user_eq: user_id
            },
            raw: true
        });

        const todo = await todos.findAll({
            where: {
                bbs_eq: sub_url
            },
            raw: true
        });
        const postfile = await post_file.findAll({
            where: {
                target_id: user_id,
                file_type: 'attach'
            }
        });

        if (postfile[0].dataValues.filename != null) {

            context.img_src = postfile[0].dataValues.filepath
            var str = context.img_src.substring(8, 1000);
            context.src = str

            console.log('==1=1=1=1postfile=1=1===', postfile)
            console.log('#@#@#user@#@# =>', user)
            console.log('==1=1=1=1=1=1===', postfile[0].dataValues.filepath)
            console.log('@@@FILENAME', postfile[0].dataValues.filename)
            console.log('@@str@@ =>', str)

            context.todo = todo[0]
            context.user = user[0]
        } else {
            console.log('@@!!##undefined')
            context.user = todo[0]
            context.img_src = postfile[0].dataValues.filepath
            context.post_file = undefined
            console.log('@@#!#!#!#!qwqwqwqw', context.post_file)
        }

    } else {
        context.user = undefined
        context.todo = undefined
    }

    res.render('board/board_view', context);
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