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
var bitcoinRPC = require("node-bitcoin-rpc");

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

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

function getFeeOfTx(txid){
    //returns a promise and fetches tx output value given by index
    return queue.pushTask(function getInputValues(resolve, reject){
        bitcoinRPC.callAsync('getmempoolentry', [txid])
        .then(function (res){
            resolve(res.result.fee * 100000000);
        })
        .catch(function (err){
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

                getFeeOfTx(txid)
                .then(function (fee){
                    let totalSent = 0;
                    tx.outs.forEach(function (out) {
                      totalSent += out.value;
                    })
                    totalSent = (totalSent / 100000000).toFixed(8); //we convert satoshi to BTC
                    io.emit(topic.toString(),{
                        txid: tx.getId(),
                        totalSent: totalSent,
                        byteLength: tx.byteLength(),
                        hasWitnesses: tx.hasWitnesses(),
                        weight: tx.weight(),
                        fee: fee
                    });
                })
                .catch(function (err){
                    console.error('There was an error during getmempoolentry RPC');
                    console.error('error is: ' + err);
                });

            }
            else io.emit(topic.toString(), {data: message.toString('hex')});
        }
    });

  //console.log('received a message related to:', topic.toString(), 'containing message:', message.toString('hex'));
});
