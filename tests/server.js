var should = require("should");

describe('server.js has the rest API which calls methods of bitcoind through rpc', function(){
	it('should return object for /api/getinfo');
	it('should return list of peer objects for /api/getpeerinfo');
	it('should return list of inbound peers for /api/getpeerinfo/inbound');
	it('should return list of outbound peers for /api/getpeerinfo/outbound');
	it('should return number of connections for /api/getconnectioncount');
	it('should return network info object for /api/getnetworkino');
	it('should return mempoolinfo objet for /api/getmempoolinfo');
	it('should return mempool entry identified by <hash> at /api/getmempoolentry/<hash>');
	it('should return block hash given the block height at /api/getblockhash/<index>');
	it('should return block object when <hash> is given at /api/getblock/hash');
	it('should return estimated fee for <nblocks> at /api/estimatefee/<nblocks>');
});
