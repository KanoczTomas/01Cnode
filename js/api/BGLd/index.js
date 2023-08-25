'use strict';

var BGLd = require("express").Router();
var config = require("config");
var Promise = require("bluebird");
var bitgesellRPC = require("node-bitcoin-rpc");
var os = require("os");
Promise.promisifyAll(bitgesellRPC);
var getSize = require('nodejs-fs-utils').fsize;
Promise.promisifyAll(getSize);


bitgesellRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

BGLd.get("/status", function(req, res){
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

    BGLd.get(entry.uri, function(req, res) {
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
            bitgesellRPC.setTimeout(entry.timeout);
        }
        bitgesellRPC.callAsync(entry.callName, inputString)
        .then(function(value){
            res.status(200).json(value.result).end();
        })
        .error(function(error){
            res.status(200).json({status: "error", error: error.toString()}).end();
        });
    })
});

module.exports = BGLd;
