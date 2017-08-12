require("../angular-helper");
var config = require("config");
var should = require("should");
require("../../../js/app");


describe('filter bytes', function(){
    var filter;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(inject(function($injector){
        var $filter = $injector.get('$filter');
        filter = $filter('bytes');
    }));
    
    
    it('should return a string', function(){
        filter(139).should.be.a.String();
    });
    it('should return "-" if input not a number', function(){
        filter('test').should.be.equal('-');
    });
    it('should return "-" if input is 0', function(){
        filter(0).should.be.equal('-');
    });
    it('should return "-" if input is infinity', function(){
        filter(Infinity).should.be.equal('-');
    });
    it('should have precision equal 2 if not given', function(){
        filter(200000000).split(" ")[0].split(".")[1].length.should.be.equal(2);
    });
    it('should have precision equal n if precision set to n', function(){
        filter(2000000000, undefined, 4).split(" ")[0].split(".")[1].length.should.be.equal(4);
    });
    it('should use the given unit if unit input variable set else return closest unit', function(){
        filter(1524,'test').split(" ")[1].should.be.equal('kBi');
        filter(1524,'MBi',4).should.be.equal("0.0015 MBi");
        filter(1524,'GBi',10).should.be.equal("0.0000014193 GBi");
        filter(16106127360).should.be.equal("15.00 GBi");
        filter(16106127360,'kBi').should.be.equal("15728640.00 kBi");
        filter(16106127360,'bytes').should.be.equal("16106127360 bytes");
    });
    it('should return 1023 bytes for 1023', function(){
        filter(1023).should.be.equal("1023 bytes");
    });
    it('should return 1 kBi for 1024 bytes', function(){
        filter(1024).should.be.equal("1.00 kBi");
    });
    it('should return 1 MBi for 1024*1024 bytes', function(){
        filter(1024*1024).should.be.equal("1.00 MBi");
    });
    it('should return 1 GBi for 1024*1024*1024 bytes', function(){
        filter(1024*1024*1024).should.be.equal("1.00 GBi");
    });
    it('should return 1 TBi for 1024*1024*1024*1024 bytes', function(){
        filter(1024*1024*1024*1024).should.be.equal("1.00 TBi");
    });
    it('should return 1 PBi for 1024*1024*1024*1024*1024 bytes', function(){
        filter(1024*1024*1024*1024*1024).should.be.equal("1.00 PBi");
    });
});
