let queue = "quotationQuene2";
let amqp = require('amqplib/callback_api');
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let $ = require("./methods.js");

app.disable('x-powered-by');

let version = process.versions.node; // 10.0.0;
var reg = /^(\d{1,})\.(\d{1,})\.(\d{1,})/;
const cpuNums = require('os').cpus().length;
var cluster = {};
if (reg.exec(version) && RegExp.$1 >= 10) {
  cluster = require('cluster');
}

let options = {
  hostname: '115.159.200.179',
  port: 5672,
  vhost: '/quotationQuene', //host渠道
  username: 'guest',
  password: 'guest'
};

let info = {
  "durable": true,
  "auto_delete": false,
  "durable": true,
  "arguments": {
    "x-message-ttl": 10000,
    "x-max-length": 1000
  }
}

// Consumer
function connectRabbitMQ() {

  function on_open(err, ch) {
    try {
      if (err != null) {$.logger.debug(err)};
      ch.assertQueue(queue, info);
      ch.consume(queue, function(msg) {
        if (msg !== null) {
          io.emit('chat message', msg.content.toString());
          ch.ack(msg);
        }
      });
    } catch (e) {
      $.logger.debug(e);
    }
  }

  function consumer(conn) {

    conn.on("error", function(err) {
      console.log("connection to RabbitMQ error !");
      $.logger.debug(err);
    });

    conn.on("close", function(err) {
      console.log("connection to RabbitQM closed!");
      $.logger.debug(err);
      $.logger.debug(process.memoryUsage());
      setTimeout(() => {
        connectRabbitMQ();
      }, 10000)
    });

    try {
      conn.createChannel(on_open);
    } catch (e) {
      $.logger.debug(e);
    }

  }

  try {
    amqp.connect(options, function(err, conn) {
      if (err != null) bail(err);
      console.info("connect to RabbitMQ success");
      consumer(conn);
    });
  } catch (e) {
    $.logger.debug(e);
  }
}

const Pool = require('worker-threads-pool');
const pool = new Pool({
  max: 4
})

for(let i =1;i<=4;i++) {
  pool.acquire(__filename, {}, function(worker) {
    connectRabbitMQ();
    worker.on('exit', function() {
      console.log(`worker exited (pool size: ${pool.size})`)
    })
  })
}

http.listen(3000, function() {
  console.info('socket.io listening on:3000'); //io接口
});

console.info(`工作进程 ${process.pid} 已启动`);

module.exports = app;
module.exports.connectRabbitMQ = connectRabbitMQ;
module.exports.httpSocket = http;
module.exports.cpuNums = cpuNums;
module.exports.cluster = cluster;
