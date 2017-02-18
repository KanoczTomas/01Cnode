var bitcoind = require("express").Router();
var config = require("config");
var Promise = require("bluebird");
var bitcoinRPC = require("node-bitcoin-rpc");
Promise.promisifyAll(bitcoinRPC);

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

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
