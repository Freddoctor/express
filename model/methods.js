const log = require("./logger");

const log4js = require("log4js");

log4js.configure({
  appenders: {
    ruleConsole: {
      type: 'console'
    },
    ruleFile: {
      type: 'dateFile',
      filename: 'logs/server-',
      pattern: 'yyyy-MM-dd.log',
      maxLogSize: 10 * 1000 * 1000,
      numBackups: 3,
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['ruleConsole', 'ruleFile'],
      level: 'info'
    }
  }
});

var logger = log4js.getLogger();
logger.level = 'debug';

function promise(res) {
  return new Promise(function(resolve, reject) {
    resolve(res)
  });
}

module.exports = {
  promise,
  log,
  logger
}
