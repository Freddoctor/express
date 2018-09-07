const express = require('express');
const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

const amqp = require('amqplib');

app.disable('x-powered-by');

const options = {
  hostname: '115.159.200.179',
  port: 5672,
  vhost: '/quotationQuene', //host渠道
  username: 'guest',
  password: 'guest'
};

amqp.connect(options).then((conn) => {
  try {
    spread(conn);
  } catch (e) {

  }
}).then(null,console.warn);

function spread(conn) {
  conn.createChannel().then((ch) => {
    try {
      accepTo(ch, "quotationQuene2");
    } catch (e) {

    }
  })
}

function accepTo(ch, q) {
  let options = {};
  
  //"durable": true, "arguments": {  "x-message-ttl": 10000,"x-max-length": 1000 }
  ch.consume(q, (msg) => {
    console.log(msg.content.toString())
    if (msg !== null) {
      io.emit('chat message', msg.content.toString());
      ch.ack(msg);
    }
  }, options);
}

http.listen(3000, function() {
  console.log('listening on *:3000'); //io接口
});

module.exports = app;
