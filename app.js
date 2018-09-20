var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// DEBUG: 报错预警
var domain = require("domain").create();
var http = require('http');
// var sql = require("./model/sql");
//路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//请求接口
var model = require('./model/model');
var publish = require('./model/publish');
var log = require('./model/logger');
var app = express();
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/users', usersRouter);

app.use(model);

app.use(publish);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handlerss
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

domain.on("error", (err) => {
  console.log(err)
})

if (publish.cluster.isMaster) {
  for (let i = 0; i < publish.cpuNums; i++) {
    publish.cluster.fork();
  }
  log.info(`主进程 ${process.pid} 正在运行`);
  process.on('exit', (code) => {
    console.log(code);
  });
} else {
  publish.connectRabbitMQ();
}

publish.httpSocket.listen(3000, function() {
  log.warn('socket.io listening on:3000'); //io接口
});

module.exports = app;
