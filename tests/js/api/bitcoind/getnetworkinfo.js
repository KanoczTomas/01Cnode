var should = require("should");
var request = require("supertest");
var config = require("config");

describe('bitcoind rpc call restful API routing tests:', function(){
var url = "http://localhost:" + config.get('Web.port');
	describe('/api/bitcoind/getnetworkinfo tests:', function(done){
		var route = "/api/bitcoind/getnetworkinfo";
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
				res.body.should.be.Object()
				done();
			});
		});
		it('returned json object should contain an attribute networks, which is an array', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.networks.should.be.an.Array();
				done();
			})
		});
		it('returned json object should contain an attribute localaddresses, which is an array', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.localaddresses.should.be.an.Array();
				done();
			})
		});
	});
});
