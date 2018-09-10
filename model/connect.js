const amqp = require("amqplib");
const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http,{
  pingInterval: 25000,
  pingTimeout: 60000,
});

{ transports: ['websocket'] }

const queue = "quotationQuene2";

app.disable('x-powered-by');

var connection;
// 连接RabbitMQ
const options = {
  hostname: '115.159.200.179',
  port: 5672,
  vhost: '/quotationQuene', //host渠道
  username: 'guest',
  password: 'guest'
};

 const info = {
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
    const channel = await connection.createChannel();
    await channel.assertQueue(queue,info);
    await channel.consume(queue, async function(message) {
      // console.log(message.content.toString());
      if (message !== null) {
        io.emit('chat message', message.content.toString());
        channel.ack(message);
      }
    });
    connection.on("error", function(err) {
      console.log(err);
      setTimeout(connectRabbitMQ, 10000);
    });
    connection.on("close", function() {
      console.error("connection to RabbitQM closed!");
      setTimeout(connectRabbitMQ, 10000);
    });
  } catch (err) {
    console.error(err);
    setTimeout(connectRabbitMQ, 10000);
  }
}

http.listen(3000, function() {
  console.log('listening on *:3000'); //io接口
});

connectRabbitMQ();

module.exports = app;
