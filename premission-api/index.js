const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const vipLogin = require('./db/vip_login.json');
const adminLogin = require('./db/admin_login.json');
const adminpremission = require('./db/admin_premission.json');
const vippremission = require('./db/vip_premission.json');
const url = require('url');
const successCode = 200;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/login', function (req, res) {
    const username = url.parse(req.url, true).query.username;
    if (username === 'vip') {
        res.send({
            code: successCode,
            msg: '登录成功',
            ...vipLogin
        });
    } else if (username === 'admin') {
        res.send({
            code: successCode,
            msg: '登录成功',
            ...adminLogin
        });
    } else {
        res.send({
            code: 1,
            msg: '用户不存在'
        });
    }
})
app.post("/userInfo", function (req, res) {
    console.log(req.body);
    // res.send({
    //         code: successCode,
    //         msg: '成功',
    //     });
    const {username} = req.body;
    if (username === 'vip') {
        res.send({
            code: successCode,
            msg: '登录成功',
            ...vippremission
        });
    } else if (username === 'admin') {
        res.send({
            code: successCode,
            msg: '登录成功',
            ...adminpremission
        });
    } else {
        res.send({
            code: 1,
            msg: '用户不存在'
        });
    }
})
app.use(express.static(__dirname + '/public'));
app.listen(port);
console.log('Server started at http://localhost:' + port);