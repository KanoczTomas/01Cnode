require("../angular-helper");
var config = require("config");
var should = require("should");
require("../../../js/app");


describe('filter secondsToDateTime', function(){
    var filter;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(inject(function($injector){
        var $filter = $injector.get('$filter');
        filter = $filter('secondsToDateTime');
    }));
    
    it('should return 00:00:00 if input not a number', function(){
        filter('test').should.be.equal('00:00:00');
        filter(null).should.be.equal('00:00:00');
        filter(undefined).should.be.equal('00:00:00');
        
    });
    it('should return 00:00:00 if input is infinity', function(){
        filter(Infinity).should.be.equal('00:00:00');
    });
    it('should return 00:00:00 if input is NaN', function(){
        filter(NaN).should.be.equal('00:00:00');
    });
    it('should return 00:00:00 for negative inputs', function(){
        filter(-1).should.be.equal('00:00:00');
    });
    it('should return 0 days 00:00:00 for 0', function(){
        filter(0).should.be.equal('0 days 00:00:00');
    });
    it('should return 0 days 00:00:01 for 1', function(){
        filter(1).should.be.equal('0 days 00:00:01');
    });
    it('should return 0 days 00:00:50 for 50', function(){
        filter(50).should.be.equal('0 days 00:00:50');
    });
    it('should return 0 days 00:01:50 for 110', function(){
        filter(110).should.be.equal('0 days 00:01:50');
    });
    it('should return 0 days 01:01:50 for 3710', function(){
        filter(3710).should.be.equal('0 days 01:01:50');
    });
    it('should return 0 days 23:59:59 for (23*3600) + (59*60) + 59', function(){
        filter(23*3600 + 59*60 + 59).should.be.equal('0 days 23:59:59');
    });
    it('should return 1 day 23:59:59 for (24*3600) + (23*3600) + (59*60) + 59', function(){
        filter(24*3600 + 23*3600 + 59*60 + 59).should.be.equal('1 day 23:59:59');
    });
    it('should return 10 days 23:59:59 for (10*24*3600) + (23*3600) + (59*60) + 59', function(){
        filter(10*24*3600 + 23*3600 + 59*60 + 59).should.be.equal('10 days 23:59:59');
    });
});