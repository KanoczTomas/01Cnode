var should = require("should");
var request = require("supertest");
var config = require("config");

describe('bitcoind rpc call restful API routing tests:', function(){
var url = "http://localhost:" + config.get('Web.port');
	describe('/api/bitcoind/getblockhash tests:', function(done){
		var route = "/api/bitcoind/getblock/000000009b7262315dbf071787ad3656097b892abffd1f95a1a022f896f533fc";
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
				res.body.should.be.an.Object()
				done();
			});
		});
		it('returned object should have attribute hash' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.hash.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute confirmations' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.confirmations.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute height' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.height.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute merkleroot' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.merkleroot.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute tx' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.tx.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute previousblockhash' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.previousblockhash.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute nextblockhash' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.nextblockhash.should.not.be.null();
				done();
			})
		});
	});
});
