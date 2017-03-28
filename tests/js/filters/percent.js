require("../angular-helper");
var config = require("config");
var should = require("should");
require("../../../js/app");


describe('filter percent', function(){
    var filter;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(inject(function($injector){
        var $filter = $injector.get('$filter');
        filter = $filter('percent');
    }));
    
    it('should return "-" for others than number type',function(){
        filter('test').should.be.equal("-");
    });
    it('should return "-" for infinity', function(){
        filter(Infinity).should.be.equal("-");
    });
    it('should return "-" for NaN', function(){
        filter(NaN).should.be.equal("-");
    });
    it('should return proper value', function(){
        filter(0.5).should.be.equal('50.00%');
        filter(0.05).should.be.equal('5.00%');
    });
    it('should return -.--% for negative numbers', function(){
        filter(-5).should.be.equal("-.--%");
    });
    it('should return -.--% for numbers greater than 1', function(){
        filter(1).should.be.equal('100.00%');
        filter(2).should.be.equal("-.--%");
    });
    
});