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
        //testing bibytes
        filter(1524,'test').split(" ")[1].should.be.equal('kBi');
        filter(1524,'MBi',4).should.be.equal("0.0015 MBi");
        filter(1524,'GBi',10).should.be.equal("0.0000014193 GBi");
        filter(16106127360).should.be.equal("15.00 GBi");
        filter(16106127360,'kBi').should.be.equal("15728640.00 kBi");
        filter(16106127360,'bytes').should.be.equal("16106127360 bytes");
        //testing bytes
        filter(1524,'MB',4).should.be.equal("0.0015 MB");
        filter(1524,'GB',10).should.be.equal("0.0000015240 GB");
        filter(16106127360, 'SIbytes.dynamic').should.be.equal("16.11 GB");
        filter(16106127360,'kB').should.be.equal("16106127.36 kB");
        filter(16106127360,'SIbytes').should.be.equal("16106127360 bytes");
        //testing weight
        filter(1524,'MWU',4).should.be.equal("0.0015 MWU");
        filter(1524,'GWU',10).should.be.equal("0.0000015240 GWU");
        filter(16106127360, 'WU.dynamic').should.be.equal("16.11 GWU");
        filter(16106127360,'kWU').should.be.equal("16106127.36 kWU");
        filter(16106127360,'WU').should.be.equal("16106127360 WU");
    });
    it('should return 1023 bytes for 1023', function(){
        filter(1023).should.be.equal("1023 bytes");
    });
    it('should return 1 kBi for 1024 bytes', function(){
        filter(1024).should.be.equal("1.00 kBi");
    });
    it('should return 1 kB for 1000 bytes', function(){
        filter(1000, 'SIbytes.dynamic').should.be.equal("1.00 kB");
    });
    it('should return 1 kWU for 1000 weight units', function(){
        filter(1000, 'WU.dynamic').should.be.equal("1.00 kWU");
    });
    it('should return 1 MBi for 1024*1024 bytes', function(){
        filter(1024*1024).should.be.equal("1.00 MBi");
    });
    it('should return 1 MB for 1000*1000 bytes', function(){
        filter(1000*1000, 'SIbytes.dynamic').should.be.equal("1.00 MB");
    });
    it('should return 1 MWU for 1000*1000 weight units', function(){
        filter(1000*1000, 'WU.dynamic').should.be.equal("1.00 MWU");
    });
    it('should return 1 GBi for 1024*1024*1024 bytes', function(){
        filter(1024*1024*1024).should.be.equal("1.00 GBi");
    });
    it('should return 1 GB for 1000*1000*1000 bytes', function(){
        filter(1000*1000*1000, 'SIbytes.dynamic').should.be.equal("1.00 GB");
    });
    it('should return 1 GWU for 1000*1000*1000 weight units', function(){
        filter(1000*1000*1000, 'WU.dynamic').should.be.equal("1.00 GWU");
    });
    it('should return 1 TBi for 1024*1024*1024*1024 bytes', function(){
        filter(1024*1024*1024*1024).should.be.equal("1.00 TBi");
    });
    it('should return 1 TB for 1000*1000*1000*1000 bytes', function(){
        filter(1000*1000*1000*1000, 'SIbytes.dynamic').should.be.equal("1.00 TB");
    });
    it('should return 1 TWU for 1000*1000*1000*1000 weight units', function(){
        filter(1000*1000*1000*1000, 'WU.dynamic').should.be.equal("1.00 TWU");
    });
    it('should return 1 PBi for 1024*1024*1024*1024*1024 bytes', function(){
        filter(1024*1024*1024*1024*1024).should.be.equal("1.00 PBi");
    });
    it('should return 1 PB for 1000*1000*1000*1000*1000 bytes', function(){
        filter(1000*1000*1000*1000*1000, 'SIbytes.dynamic').should.be.equal("1.00 PB");
    });
    it('should return 1 PWU for 1000*1000*1000*1000*1000 weight units', function(){
        filter(1000*1000*1000*1000*1000, 'WU.dynamic').should.be.equal("1.00 PWU");
    });
});
