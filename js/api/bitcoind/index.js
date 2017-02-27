'use strict';

var bitcoind = require("express").Router();
var config = require("config");
var Promise = require("bluebird");
var bitcoinRPC = require("node-bitcoin-rpc");
var os = require("os");
Promise.promisifyAll(bitcoinRPC);

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

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
        networkInterfacesKeys: Object.keys(os.networkInterfaces()),
		loadavg: os.loadavg()
	};
	res.status(200).json(info).end();
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
        if(entry.verbose === true){
            inputString.push(1);
        }
        if(entry.timeout){
            bitcoinRPC.setTimeout(entry.timeout);
        }
        bitcoinRPC.callAsync(entry.callName, inputString)
        .then(function(value){
            res.status(200).json(value.result).end();
        })
        .error(function(error){
            res.status(200).json({status: "error", error: error}).end();
        });
    })
});

module.exports = bitcoind;
