var should = require("should");
var request = require("supertest");
var config = require("config");

describe('bitcoind rpc call restful API routing tests:', function(){
var url = "http://localhost:" + config.get('Web.port');
	describe('/api/bitcoind/getrawtransaction/:txid tests:', function(done){
		var route = "/api/bitcoind/getrawtransaction/0e3e2357e806b6cdb1f70b54c3a3a17b6714ee1f0e68bebb44a74b1efd512098";
		it('should throw when incoret route given', function(done){
			request(url)
			.get("/something/bad")
			.expect(200)
			.end(function(err, res){
				err.should.be.Error();
				done();
			});
		});
		it('should return a http status of 200 (OK)', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200,done);
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
		it('returned object should have attribute hex' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.hex.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute txid' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.txid.should.not.be.null();
				done();
			})
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
		it('returned object should have attribute version' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.version.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute locktime' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.locktime.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute vin' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.vin.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute vout' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.vout.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute blockhash' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.blockhash.should.not.be.null();
				done();
			})
		});
		it('returned object should have attribute time' , function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.time.should.not.be.null();
				done();
			})
		});
	});
});
