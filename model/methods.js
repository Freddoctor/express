const logger = require("./logger");

function promise(res) {
  return new Promise(function(resolve, reject) {
    resolve(res)
  });
}

module.exports = {
  promise,
  logger
}
