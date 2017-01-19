var bitcoinRPC = require("node-bitcoin-rpc");
var config = require("config");
var express = require("express");
var app = express();
var morgan = require("morgan");
var bodyParser = require("body-parser");
var api = require("./js/api");

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

app.listen(config.get('Web.port'));
app.use(morgan("dev"));
app.use(bodyParser.json());
console.log("server is now running on port " + config.get('Web.port'));

app.use('/', express.static(__dirname + '/static'));
app.use('/api/', api);
