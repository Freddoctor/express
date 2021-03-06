let amqp = require("amqplib");
let express = require('express');
let app = express();

let http = require('http').Server(app);
let io = require('socket.io')(http, {
  pingInterval: 25000,
  pingTimeout: 60000,
});
let queue = "quotationQuene2";
let $ = require("./methods.js");
app.disable('x-powered-by');

let connection;
// 连接RabbitMQ
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

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect(options);
    console.info("connect to RabbitMQ success");
    let channel = await connection.createChannel();
    await channel.assertQueue(queue, info);
    await channel.consume(queue, async function(message) {
      if (message !== null) {
        await io.emit('chat message', message.content.toString());
        channel.ack(message);
      }
    });
    connection.on("error", function(err) {
      console.log("connection to RabbitMQ error !", err);
      $.logger.debug(err);
      setTimeout(connectRabbitMQ, 10000);
    });
    connection.on("close", function() {
      console.error("connection to RabbitQM closed!");
      $.logger.debug(err);
      setTimeout(connectRabbitMQ, 10000);
    });
  } catch (err) {
    console.error(err);
    $.logger.debug(err);
    setTimeout(connectRabbitMQ, 10000);
  }
}

http.listen(3000, function() {
  console.log('socket.io listening on *:3000'); //io接口
});

connectRabbitMQ();

module.exports = app;
