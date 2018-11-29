var cluster = require('cluster');
if (cluster.isMaster) {
    // // Keep track of http requests
    // let numReqs = 0;
    // setInterval(() => {
    //   console.log(`numReqs = ${numReqs}`);
    // }, 1000);
    //
    // // Count requests
    // function messageHandler(msg) {
    //   if (msg.cmd && msg.cmd === 'notifyRequest') {
    //     numReqs += 1;
    //   }
    // }


    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');
    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    //   for (const id in cluster.workers) {
    //   cluster.workers[id].on('message', messageHandler);
    // }

    cluster.on('online', function (worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    require('./server');
}
