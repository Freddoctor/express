const amqp = require('amqplib/callback_api');

const options = {
  hostname: '115.159.200.179',
  port: 5672,
  vhost: '/quotationQuene', //host渠道
  username: 'guest',
  password: 'guest'
};

amqp.connect(options, function(err, conn) {
  conn.createChannel(function(err, ch) {
    let q = 'quotationQuene1';
    var str = "{'date':'2018-09-03 15:55:46','preClosePrice':'1.30494','lowPrice':'1.30485','highPrice':'1.30753','range':'0.00004','openPrice':'1.30745','rangePercent':'0.00%','compressQuotation':['1.30498','1.30745','1.30753','1.30485','1.30494','0.00004','0.00%','2018-09-03 15:55:46'],'tradePrice':'1.30498','statusCode':'n'}"
    //链接传送
    ch.assertQueue(q, {
      "vhost": "/quotationQuene",
      "durable": true,
      "arguments": {
        "x-message-ttl": 10000,
        "x-max-length": 1000
      }
    })
    var _exit = new Date().getTime() + 5000;
    while(new Date().getTime() < _exit ) {
      ch.sendToQueue(q, new Buffer(str), {
        persistent: true
      })
    }
  });
});
