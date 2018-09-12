let queue = "quotationQuene2";
let amqp = require('amqplib/callback_api');
let express = require('express');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let $ = require("./methods.js");
// require("v8").setFlagsFromString('--expose_gc');
// global.gc = require("vm").runInNewContext('gc');
// setInterval(()=>{
//   global.gc();
// },1000)
app.disable('x-powered-by');

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
  let bail = function(err) {
    $.logger.debug(err);
    // process.exit(1);
  }
  let consumer = function(conn) {
    let watchError = conn.on("error", function(err) {
      console.log("connection to RabbitMQ error !");
      $.logger.debug(err);
    });
    let watchClose = conn.on("close", function(err) {
      console.log("connection to RabbitQM closed!");
      $.logger.debug(err);
      $.logger.debug(process.memoryUsage());
      setTimeout(() => {
        connectRabbitMQ();
      }, 10000)
    });
    let on_open = function(err, ch) {
      try {
        if (err != null) bail(err);
        ch.assertQueue(queue, info);
        ch.consume(queue, function(msg) {
          if (msg !== null) {
            io.emit('chat message', msg.content.toString());
            ch.ack(msg);
            //  global.gc();
          }
        });
      } catch (e) {
        $.logger.debug(e);
      }
    }

    try {
      let ok = conn.createChannel(on_open);
      ok = null;
    } catch (e) {
      $.logger.debug(e);
    }
    watchError = null;
    watchClose = null;
  }

  try {
    amqp.connect(options, function(err, conn) {
      if (err != null) bail(err);
      console.info("connect to RabbitMQ success");
      let compulish = consumer(conn);
      compulish = null;
    });
  } catch (e) {
    $.logger.debug(e);
  }
}

connectRabbitMQ();

http.listen(3000, function() {
  console.log('socket.io listening on *:3000'); //io接口
});

module.exports = app;
module.exports.connectRabbitMQ = connectRabbitMQ;
