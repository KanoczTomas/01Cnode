var bitcoinRPC = require("node-bitcoin-rpc");
var config = require("./config");
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");

bitcoinRPC.init(config.rpcConfig.host, config.rpcConfig.port, config.rpcConfig.rpc_username, config.rpcConfig.rpc_password);

app.listen(config.port);
app.use(morgan("dev"));
app.use(bodyParser.json());
console.log("server is now running on port " + config.port);

app.use('/', express.static(__dirname + '/static'));
