const express = require('express');
const router = express.Router();
const app = express();
const cookieParser = require('cookie-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.render('index', {
    title: '登录注册'
  });
});

router.get('/home', function(req, res, next) {
  if (req.cookies.username && req.cookies.password) {
    return res.render('home', {
      title: 'Soket.io测试'
    })
  } else {
    console.log("未登录,即将跳頁面。。。。。。");
    setTimeout(() => {
      res.redirect("/");
    }, 1000);
  }
});

app.use(cookieParser());

module.exports = router;
