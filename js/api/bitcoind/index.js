'use strict';

var bitcoind = require("express").Router();
var config = require("config");
var Promise = require("bluebird");
var bitcoinRPC = require("node-bitcoin-rpc");
var os = require("os");
Promise.promisifyAll(bitcoinRPC);
var getSize = require('get-folder-size');
Promise.promisifyAll(getSize);
 
//getSize(myFolder, function(err, size) {
//  if (err) { throw err; }
// 
//  console.log(size + ' bytes');
//  console.log((size / 1024 / 1024).toFixed(2) + ' Mb');
//});


bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

bitcoind.get('/hashrate', function(req, res){
    
    var timeSpanUsedToCalculateHashRateInHours = 24*7;
    var info = {
        blocks : [],
        lastDifficulty: 0,
        idealBlockCount: timeSpanUsedToCalculateHashRateInHours * 6, 
        hashrate: 0,
        timeToProcess: Date.now(),
        averageSize: 0,
        averageWeight: 0
    }
    //we will fetch block headers for last 3 days now
    //definining helper promise returning functions
    function getBlockCount(){
        return bitcoinRPC.callAsync('getblockcount', [])
        .then(function (res){
            return res.result;
        })
        .error(function (err){
            return Promise.reject({
                method: 'getblockcount',
                error: err
            });
        });
    }
    function getBlockHash(height){
        return bitcoinRPC.callAsync('getblockhash', [height])
        .then(function (res){
            return res.result;
        })
        .error(function (err){
            return Promise.reject(err);
        });
    }
    function getBlock(hash){
        return bitcoinRPC.callAsync('getblock', [hash])
        .then(function (res){
            return res.result;
        })
        .error(function (err){
            return Promise.reject(err);
        });
    }
    function getBlockHeader(hash){
        return bitcoinRPC.callAsync('getblockheader', [hash])
        .then(function (res){
            return res.result;
        })
        .error(function (err){
            return Promise.reject(err);
        });
    }
    function getDifficulty(hash){
        return bitcoinRPC.callAsync('getdifficulty', [])
        .then(function (res){
            return res.result;
        })
        .error(function (err){
            return Promise.reject(err);
        });
    }
    Promise.coroutine(function *gen(){
        try{
            var blocks = yield getBlockCount();
            console.log('we have this many blocks: ' + blocks);
            console.log('starting fetching blocks for hashrate calculation');
            //we get back miliseconds from Date.now(), bitcoind sends us seconds from jan 1 1970, so we need to devide by 1000
            var nHoursAgo = (Date.now() - (timeSpanUsedToCalculateHashRateInHours*60*60*1000))/1000; 
            console.log('nHoursAgo is: ' + nHoursAgo);
            var i = 0;
            do {
                var blockHash = yield getBlockHash(blocks - i);
                var blockHeader = yield getBlockHeader(blockHash);
                info.blocks.push(blockHeader);
                if(i % 3 === 0)     process.stdin.write('\rfetching .  ');
                else if(i % 3 === 1)process.stdin.write('\rfetching .. ');
                else if(i % 3 === 2)process.stdin.write('\rfetching ...');
            }while(Number(info.blocks[i++].time) > nHoursAgo);
            process.stdin.write('\r\n');
            info.blocks.pop();//last block in the list has to be popped, because of do while
            console.log('fetched ' + info.blocks.length + ' blocks.');
            console.log('should have been: ' + info.idealBlockCount);
            var difference = info.blocks.length - info.idealBlockCount;
            console.log('difference: ' + difference);
            
            info.lastDifficulty = yield getDifficulty();
            console.log('difficulty is: ' + info.lastDifficulty);
            //using hashrate equation from:
            //https://github.com/KanoczTomas/bitcoin-learn/wiki/Calculating-Bitcoin-Hash-rate
            var correctionFactor = info.blocks.length/(6*timeSpanUsedToCalculateHashRateInHours);
            console.log('correctionFactor is: ' + correctionFactor);
            info.hashrate = (correctionFactor * Math.pow(2,32) * info.lastDifficulty)/600;
            console.log('hashrate is: ' + info.hashrate);
            var averageTime = 600/correctionFactor;
            var averageTimeMinutes = Math.floor(averageTime/60);
            var averageTimeSeconds = (averageTime/60 - Math.floor(averageTime/60)) * 60;
            console.log('average block time is: ' + averageTimeMinutes + 'm ' + averageTimeSeconds.toFixed(2) + 's');
            info.timeToProcess = (Date.now()  - info.timeToProcess)/1000;
            
            console.log('fetching last ' + timeSpanUsedToCalculateHashRateInHours + 'h block sizes, please be patient');
            var fetchTime = Date.now();
            
            for(let i=0; i < info.blocks.length; i++){
                process.stdin.write('\rfetching ' + info.blocks[i].hash + ' - ' + (i+1) + ' of ' + info.blocks.length + ' total blocks\n');
                
                console.log(info.blocks.length);
                console.log(info.blocks[i].hash);
                
                let block = yield getBlock(info.blocks[i].hash);
                info.averageSize += Number(block.size);
                info.averageWeight += Number(block.weight);
            }
            process.stdin.write('\n');
            let fetchTimeFinish = Date.now();
            info.timeToProcessBlockSize = (fetchTimeFinish - fetchTime)/1000;
            console.log('processing took ' + info.timeToProcessBlockSize + ' seconds');
            

            info.averageSize = info.averageSize/info.blocks.length;
            info.averageWeight = info.averageWeight/info.blocks.length;
            
            console.log('average blocks size: ' + info.averageSize );
            return Promise.resolve({
                hashrate: info.hashrate,
                timeToProcess: info.timeToProcess,
                lastDifficulty: info.lastDifficulty,
                averageSize: info.averageSize,
                averageWeight: info.averageWeight,
                timeToProcessBlockSize: info.timeToProcessBlockSize
            });
        }
        catch(err){
            console.error('there was an error');
            return Promise.reject(err);
        }
    })()
    .then(function (info){
        res.status(200).json(info).end();
    })
    .error(function (err){
        res.status(400).json(err).end();
    });
    


});

bitcoind.get("/status", function(req, res){
	var info = {
		arch: os.arch(),
		cpus: os.cpus(),
		freemem: os.freemem(),
		uptime: os.uptime(),
		totalmem: os.totalmem(),
		platform: os.platform(),
		release: os.release(),
		hostname: os.hostname(),
		networkInterfaces: os.networkInterfaces(),
		loadavg: os.loadavg()
	};
    getSize(config.get('Bitcoin.homeDir'), function(error,size){
        if(!error){
            info.blockchainSize = size;
            res.status(200).json(info).end();    
        }
        else res.status(400).json(error).end();
    });
});

config.get('Api.restCalls').forEach(function(entry){
    
    bitcoind.get(entry.uri, function(req, res) {
        var inputString = [];
        if(entry.inputType === 'string'){
            inputString.push(req.params[entry.inputName]);
        }
        else if(entry.inputType === 'number'){
            inputString.push(Number(req.params[entry.inputName]));
        }
        if(typeof entry.verbose === 'boolean'){
            if(entry.inputType === 'number') entry.verbose = Number(entry.verbose);
            inputString.push(entry.verbose);
        }
        if(entry.timeout){
            bitcoinRPC.setTimeout(entry.timeout);
        }
        bitcoinRPC.callAsync(entry.callName, inputString)
        .then(function(value){
            res.status(200).json(value.result).end();
        })
        .error(function(error){
            res.status(200).json({status: "error", error: error.toString()}).end();
        });
    })
});

module.exports = bitcoind;
