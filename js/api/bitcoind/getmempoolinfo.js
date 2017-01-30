var bitcoinRPC = require("node-bitcoin-rpc");
var config = require("config");

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

module.exports = function(req, res, next){
	bitcoinRPC.call('getmempoolinfo', [], function(err, value){
		if(err !== null){
			res.status(404).json(err);
			next();
		}
		else{
			res.status(200).json(value.result);
			next();
		}
	});
}
