var bitcoinRPC = require("node-bitcoin-rpc");
var config = require("config");

bitcoinRPC.init(config.get('RPC.host'), config.get('RPC.port'), config.get('RPC.rpc_username'), config.get('RPC.rpc_password'));

module.exports = function(req, res, next){
	bitcoinRPC.setTimeout(2000);
	bitcoinRPC.call('getrawmempool', [], function(err, value){
		if(err !== null) throw(Error(err));
		else{
			res.status(200).json(value.result);
			next();
		}
	});
}
