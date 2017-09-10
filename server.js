'use strict';

var config = require("config");
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var api = require("./js/api");
var cluster = require("cluster");
var zmq = require("zeromq")
var sock = zmq.socket("sub");
var os = require("os");
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var compression = require("compression");
var fs = require("fs");
var path = require("path");
var logFile = path.join(__dirname, "server.log");
var bjs = require('bitcoinjs-lib');
var bitcoinRPC = require("node-bitcoin-rpc");
var Promise = require('bluebird');
Promise.promisifyAll(bitcoinRPC);


bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));



// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
//    var cpuCount = os.cpus().length;

    // Create a worker for each CPU
//    for (var i = 0; i < cpuCount; i += 1) {
//        cluster.fork();
//    }
    
    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker,
        // we're not sentimental
        console.log('Worker %d died :(', worker.id);
    //    cluster.fork();
    });

// Code to run if we're in a worker process
} //else {

    server.listen(config.get('Web.port'));
    app.use(compression());
    var accessLogStream = fs.createWriteStream(logFile, {flags: 'a'})
    console.log("logging to file: " + logFile);
    app.use(morgan("combined", {stream: accessLogStream}));
    app.use(bodyParser.json());
    console.log("server is now running on port " + config.get('Web.port'));

    app.use('/api/', api);
    app.use('/', express.static(__dirname + '/static'));

    if(process.env.NODE_ENV !== 'production') {
      process.once('uncaughtException', function(err) {
        console.error('FATAL: Uncaught exception.');
        console.error(err.stack||err);
        setTimeout(function(){
          process.exit(1);
        }, 100);
      });
    }

    sock.connect(config.get('Zmq.socket'));
    config.get('Zmq.events').forEach(function(event){
       sock.subscribe(event); 
    });
    
    io.on('connection', function(data){
        //console.log("data is: " + data) ;
        //console.log(data);
    });
    sock.on('message', function(topic, message) {
        var events = [
            'hashtx',
            'hashblock',
            'rawtx'
        ];
        events.forEach(function(event){
            if(topic.toString() === event){
                if(event === 'rawtx'){
                    var txHex = message.toString('hex');
                    var id, fee
                    var inputTotal = 0, outputTotal = 0;
                    try {
                        var tx = bjs.Transaction.fromHex(txHex);
                    }
                    catch (err){
                        console.error(err);
                        console.error('Something went bad when fething tx ' + txHex);
                    }
                    var workQueue = [];
                    try{
                        tx.ins.forEach(function (input){
                            var txId = Buffer.from(input.hash.toString('hex'),'hex');
                            for(var i = 0, j = txId.length - 1; i < txId.length; i++, j--){
                                txId[i] = input.hash[j];
                            }//we reverse the bytes as input.hash has it backwards
                            var index = input.index;//we need to remember the index of the input, so we can reference its value below
                            txId = txId.toString('hex');
                            workQueue.push(
                                bitcoinRPC.callAsync('gettransaction', [txId])
                                .then(function (res){
                                    var tx = bjs.Transaction.fromHex(res.result.hex)         ;                           
                                    return tx.outs[index].value;
                                })
                            );
                        });
                    }
                    catch (err){
                        console.error('something went wrong with fetching inputs of tx ' + txHex);
                        console.error(err);
                    }
                    Promise.all(workQueue)
                    .then(function (res){
                        tx.outs.forEach(function (output){
                            outputTotal += output.value;
                        });
                        res.forEach(function (inputValue){
                            inputTotal += inputValue;
                        });
                        fee = inputTotal - outputTotal;
                        io.emit(topic.toString(),{
                            data: txHex,
                            fee: fee
                        });
                    });
                    
                    
                    
                }
                else io.emit(topic.toString(), {data: message.toString('hex')});
            }
        });
        
      //console.log('received a message related to:', topic.toString(), 'containing message:', message.toString('hex'));
    });
    
//}
