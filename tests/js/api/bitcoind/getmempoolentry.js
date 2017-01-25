var should = require("should");
var request = require("supertest");
var config = require("config");
var _ = require("underscore");

describe('bitcoind rpc call restful API routing tests:', function(){
	describe('/api/bitcoind/getmempoolentry/:hash tests:', function(done){
		var url = "http://localhost:" + config.get('Web.port');
		var route;
		before('we retrieve the url hash first', function(done){
			request(url)
			.get('/api/bitcoind/getrawmempool')
			.expect(200)
			.end(function(err, res){
				hash = _.clone(res.body[0]);
				route = "/api/bitcoind/getmempoolentry/" + hash;
				done();
			});
		});
		
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
		it('returned json object should have attribute size', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.size.should.not.be.null()
				done();
			});
		});
		it('returned json object should have attribute fee ', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.fee.should.not.be.null()
				done();
			});
		});
		it('returned json object should have attribute depends', function(done){
			request(url)
			.get(route)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res){
				res.body.depends.should.not.be.null()
				done();
			});
		});
	});
});
