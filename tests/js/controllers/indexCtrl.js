'user strict';

var config = require("config");
var should = require("should");
require("../angular-helper");
require("../../../js/app.js");

describe('indexCtrl', function(){
    var $q, scope, getInfoSrv, $rootScope, createController;
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(ngModule(function($provide){
        $provide.factory('getInfoSrv', function($q){
            return $q.when({
                testnet: false,
                pageName: 'nice page'
            });
        });
    }));
    
    beforeEach(inject(function($injector){
        $q = $injector.get('$q');
        $rootScope = $injector.get('$rootScope');
        $controller = $injector.get('$controller');
        scope = $rootScope.$new();
        createController = function(){
            return $controller('indexCtrl', { $scope: scope });
        };
        
    }));
    it('should correctly assign testnet and pageName attributs from getInfoSrv', function(){
        var controller = createController();
        scope.$digest();//we want the $scope lifecycle to fire, as we need the getInfoSrv resolved
        scope.testnet.should.be.false();
        scope.pageName.should.be.equal("nice page");
    });
});