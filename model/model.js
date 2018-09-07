const express = require('express');
// const cookieParser = require('cookie-parser');
const $ = require("./methods");

var path = require('path');
var app = express();

app.disable('x-powered-by');

app.get('/model/list', function(req, res) {
  res.send({
    code: 10000,
    data: {info: "成功"}
  });
})

app.post('/model/setting', function(req, res, next) {
  $.logger.debug(req.body);
  if(!req.body.user && !req.body.password) return false;
  if (req.xhr) {
    res.send({
      code: 10000,
      data: {info: "成功"}
    });
  } else {
    next();
  }
})

app.use(function(req, res, next) {
  console.log("發送成功");
  next();
});

app.use(function(req, res) {
  console.log("即將返回");
  res.redirect("/home");
});

module.exports = app;
