var express = require('express');
var router = express.Router();

const { getConnection, Users, UsersLogin, Todos } = require('../connection')

router.get('/', async (req, res) => {

    console.log('req.session = ', req.session);

    // const pageNum = Number(req.query.pageNum) || 1; // NOTE: 쿼리스트링으로 받을 페이지 번호 값, 기본값은 1
    // const contentSize = 10; // NOTE: 페이지에서 보여줄 컨텐츠 수.
    // const pnSize = 10; // NOTE: 페이지네이션 개수 설정.
    // const skipSize = (pageNum - 1) * contentSize; // NOTE: 다음 페이지 갈 때 건너뛸 리스트 개수.

    

    // const totalCount = Number(countQueryResult[0].count); // NOTE: 전체 글 개수.
    // const pnTotal = Math.ceil(totalCount / contentSize); // NOTE: 페이지네이션의 전체 카운트
    // const pnStart = ((Math.ceil(pageNum / pnSize) - 1) * pnSize) + 1; // NOTE: 현재 페이지의 페이지네이션 시작 번호.
    // let pnEnd = (pnStart + pnSize) - 1; // NOTE: 현재 페이지의 페이지네이션 끝 번호.
   
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