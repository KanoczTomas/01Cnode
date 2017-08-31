'user strict';

var config = require("config");
var should = require("should");
require("../angular-helper");
require("../../../js/app.js");

describe('indexCtrl', function(){
    var $q, scope, getInfoSrv, $rootScope, createController;
    var chainName; //helper in chain set tests
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(ngModule(function($provide){
        $provide.factory('getInfoSrv', function($q){
            return $q.when({
                testnet: false,
                pageName: 'nice page',
                chain: setChainName(chainName),
                pageName: 'nice page',
                synced: true
            });
        });
    }));
    
    function setChainName(chainName){
        return chainName;
    }
    
    beforeEach(inject(function($injector){
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        scope = $rootScope.$new();
        createController = function(){
            return $controller('indexCtrl', { $scope: scope });
        };
        
    }));
    it('should set pageName attribute from getInfoSrv', function(){
        createController();
        scope.$digest();//we want the $scope lifecycle to fire, as we need the getInfoSrv resolved
        scope.pageName.should.be.equal("nice page");
    });
    it('should have regtest, main, testnet and synced attributes of $scope set to false initially', function(){
        createController();
        scope.testnet.should.be.false();
        scope.regtest.should.be.false();
        scope.main.should.be.false();
        scope.synced.should.be.false();
    });
    it('should set $scope.regtest correctly', function(){
        chainName = 'regtest';
        createController();
        scope.$digest();
        scope.testnet.should.be.false();
        scope.regtest.should.be.true();
        scope.main.should.be.false();
    });
    it('should set $scope.testnet correctly', function(){
        chainName = 'testnet';
        createController();
        scope.$digest();
        scope.testnet.should.be.true();
        scope.regtest.should.be.false();
        scope.main.should.be.false();
    });
    it('should set $scope.main correctly', function(){
        chainName = 'main';
        createController();
        scope.$digest();
        scope.testnet.should.be.false();
        scope.regtest.should.be.false();
        scope.main.should.be.true();
    });
    it('should set $scope.synced correctly', function(){
        createController();
        scope.$digest();
        scope.synced.should.be.true();
    })
});