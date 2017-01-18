var bitcoinRPC = require("node-bitcoin-rpc");
var config = require("./config.js");

bitcoinRPC.init(config.host, config.port, config.rpc_username, config.rpc_password);

bitcoinRPC.call('getinfo', [], function(err, res){
	if(err){
		console.error("we have a problem calling getinfo: " + res.error);
	}
	else{
		console.log(res.result);
	}
});
