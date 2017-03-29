require("../angular-helper");
var config = require("config");
var should = require("should");
require("../../../js/app");


describe('service getInfoSrv', function(){
    var $httpBackend, getInfoSrv, $rootScope, scope;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        getInfoSrv = $injector.get('getInfoSrv');    
        
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/getinfo')
        .respond({
            data: {
                testnet: true,
                blocks: 100
            }
        });
        //$httpBackend.flush();//when called all $http.get methods fire and return mocked responses
        
    }));
    
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should be a Promise', function(){
        getInfoSrv.should.be.a.Promise();
    });
    it('should resolve correctly', function(){
        scope.$apply();
        return getInfoSrv.then(function(res){
            res.testnet.should.be.equal(true);
            res.pageName.should.be.equa(config.get('Client.pageName'));
            console.log("inside promise");
        });
        
        
        
    });
    
});