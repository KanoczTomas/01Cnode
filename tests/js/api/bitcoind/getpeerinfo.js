var should = require("should");
var request = require("supertest");
var config = require("config");

describe('bitcoind rpc call restful API routing tests:', function(){
var url = "http://localhost:" + config.get('Web.port');
	describe('/api/bitcoind/getpeerinfo tests:', function(done){
		var route = "/api/bitcoind/getpeerinfo";
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
		it('should return a json array of Objects', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.should.be.Array()
				res.body[0].should.be.Object();
				done();
			});
		});
		it('attribute id of Array[0] object should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body[0].id.should.not.be.null();
				done();
			})
		});
		it('attribute addr of Array[0] object should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body[0].addr.should.not.be.null();
				done();
			});
		});
		it('attribute addrlocal of Array[0] objec tshould not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body[0].addrlocal.should.not.be.null();
				done();
			});
		});
		it('attribute subver of Array[0] objec should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body[0].subver.should.not.be.null();
				done();
			});
		});
		it('attribute inbound of Array[0] objec should not be null', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body[0].inbound.should.not.be.null()
				done();
			});
		});
	});
});
