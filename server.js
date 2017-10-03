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
var Promise = require('bluebird');
var Queue = require('simple-promise-queue');
Queue.setPromise(require('bluebird'));
var request = require('request-promise');

var queue = new Queue({
    autoStart: true,
    concurrency: config.get('RPC.concurrency')
});


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

function enqueueInputValueGetter(queue, url, index){
    //returns a promise and fetches tx output value given by index
    return queue.pushTask(function getInputValues(resolve, reject){
        request(url)
        .then(function (res){
            try{
                var tx = bjs.Transaction.fromHex(res.trim());
            }
            catch(err){
                console.error('Error while fetching raw input ', res);
                console.error(err);
            }
            resolve(tx.outs[index].value);
         })
         .catch(function (err){
            console.error('there was an error during request for', url);
            reject(err);
         });
    });
}

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
                try {
                    var tx = bjs.Transaction.fromHex(txHex);
                }
                catch (err){
                    console.error('initial tx creation from raw hex failed!')
                    console.error(err);
                }
                if(tx.isCoinbase()){
                    //this is a coinbase tx, no input = no fees
                    return;
                }
                var txid = tx.getId();
                var baseUrl = 'http://' + config.get('RPC.host') + ':' + config.get('RPC.port') + '/rest/tx/';
                var workQueue = [];
                tx.ins.forEach(function (vin){
                    var url = baseUrl + vin.hash.reverse().toString('hex') + '.hex';
                    workQueue.push(enqueueInputValueGetter(queue,url,vin.index));
                });
                Promise.all(workQueue)
                .then(function (valueForEachInput){
                    var outputTotal = 0,
                        inputTotal = 0;
                    tx.outs.forEach(function (output){
                        outputTotal += output.value;
                    });
                    valueForEachInput.forEach(function (inputValue){
                        inputTotal += inputValue;
                    });
                    var fee = inputTotal - outputTotal;
                    io.emit(topic.toString(),{
                        data: txHex,
                        fee: fee
                    });
                })
                .catch(function (err){
                    if(err.name === 'StatusCodeError'){
                        console.error('There was a status code error during rawtx fetching, make sure txindex=1 and you are not running a pruned node!');
                    }
                    else {
                        console.error('There was an unknown error, dumping trace:');
                        console.error(err);
                    }
                });
            }
            else io.emit(topic.toString(), {data: message.toString('hex')});
        }
    });

  //console.log('received a message related to:', topic.toString(), 'containing message:', message.toString('hex'));
});

