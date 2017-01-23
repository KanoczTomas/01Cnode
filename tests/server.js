var should = require("should");
var request = require("supertest");
var config = require("config");

describe('bitcoind rpc call restful API routing tests:', function(){
var url = "http://localhost:" + config.get('Web.port');
	describe('/api/bitcoind/getinfo tests:', function(done){
		var route = "/api/bitcoind/getinfo";
		it('should throw when incoret route given', function(done){
			request(url)
			.get("/something/bad")
			.expect(200)
			.end(function(err, res){
				err.should.be.Error();
				done();
			});
		});
		it('should return a json object', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.should.be.Object()
				done();
			});
		});
		it('attribute connections should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				console.log(err);
				res.body.connections.should.not.be.null();
				done();
			})
		});
		it('attribute difficulty should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.difficulty.should.not.be.null();
				done();
			});
		});
		it('attribute version should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.version.should.not.be.null();
				done();
			});
		});
		it('attribute blocks should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.blocks.should.not.be.null();
				done();
			});
		});
		it('attribute protocolversion should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.protocolversion.should.not.be.null()
				done();
			});
		});
	});
		it('should return list of peer objects for /api/bitcoind/getpeerinfo');
		it('should return list of inbound peers for /api/bitcoind/getpeerinfo/inbound');
		it('should return list of outbound peers for /api/bitcoind/getpeerinfo/outbound');
		it('should return number of connections for /api/bitcoind/getconnectioncount');
		it('should return network info object for /api/bitcoind/getnetworkino');
		it('should return mempoolinfo objet for /api/bitcoind/getmempoolinfo');
		it('should return mempool entry identified by <hash> at /api/bitcoind/getmempoolentry/<hash>');
		it('should return block hash given the block height at /api/bitcoind/getblockhash/<index>');
		it('should return block object when <hash> is given at /api/bitcoind/getblock/hash');
		it('should return estimated fee for <nblocks> at /api/bitcoind/estimatefee/<nblocks>');
});
