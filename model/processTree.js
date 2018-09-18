const {
  Worker,
  isMainThread,
  parentPort,
  workerData
} = require('worker_threads');

if (isMainThread) {
  module.exports = async function parseJSAsync(script) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: script
      });
      // worker.postMessage(new Date());
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  };
} else {
  const script = workerData;
  parentPort.postMessage(script); //共享数据
  // parentPort.on('message', (msg) =>{
  //    console.log(`${workerData} worker get message: ` + msg);
  // })
}
