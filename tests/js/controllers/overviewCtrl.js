'use strict';
require("cache-require-paths");

var config = require("config");
var should = require("should");
require("../angular-helper");
require("../../../js/app.js");

describe('overviewCtrl', function(){
    var $httpBackend, $rootScope, createController, requestHandler, state = "overview", $state;
    var scope, $interval;
    
    beforeEach(ngModule(config.get('Client.appName')));
    beforeEach(inject(function ($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $state = $injector.get('$state');
        $interval = $injector.get('$interval')
        var $templateCache = $injector.get('$templateCache');
        $templateCache.put('/templates/overview.html', '');
        
        var $controller = $injector.get('$controller');
        scope = $rootScope.$new();
        createController = function(scope){
            return $injector.instantiate($state.get(state).controller,{
                "$scope": scope
            });
        };
        createController(scope);
        
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/status')
        .respond({
            cpu: "a nice cpu" ,
            uptime: 123123
        });
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/getpeerinfo').respond([
            {
                id: 0,
                ip: "127.0.0.1"
            },
            {
                id: 2,
                ip: "127.0.0.2"
            }
        ]);        
        $httpBackend.flush();//when called all $http.get methods fire in the controller and return mocked responses
        
    }));
    
        
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it.only('should GET ' + config.get('Client.apiUrlStart') + '/status and ' + config.get('Client.apiUrlStart'), function(){
        //all is covered in the before hooks
    });
    it.only('state should be overview', function(){
        $state.go(state);
        $state.current.name.should.be.equal(state);
    });
    it.only('$scope.info should be an object', function(){
        scope.$apply(); //we mast call $scope.$apply() to resolve all promises in the controller $http is a promise
        should(scope.info).be.ok();
        scope.info.should.be.an.Object();
        scope.info.cpu.should.be.equal("a nice cpu");
        scope.info.uptime.should.be.equal(123123);
    });
    it.only('$scope.peers should be an array of objects', function(){
        scope.$apply();
        should(scope.peers).be.ok();
        scope.peers.should.be.an.Array();
        scope.peers.length.should.be.equal(2);
        scope.peers[0].id.should.be.equal(0);
        scope.peers[1].id.should.be.equal(2);
    });
    it.only('$scope.refresh() should fetch ' + config.get('Client.apiUrlStart') + '/getpeerinfo', function(){
        scope.$apply();
        $httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getpeerinfo');
        scope.refresh();
        $httpBackend.flush();
    });
    it.only('should increment uptime every second', function(){
        scope.$apply();
        scope.info.uptime = 100;
        $interval.flush(1000);
        scope.info.uptime.should.be.equal(101);
        $interval.flush(1000);
        scope.info.uptime.should.be.equal(102);
    });
    it.only('$scope.loadInPercent(load) should convert unix load to percent and be in interval [0,1]', function(){
        scope.$apply();
        scope.info.cpus = {length: 4};
        scope.loadInPercent(2).should.be.equal(0.5);
        scope.loadInPercent(1000).should.be.aboveOrEqual(0).and.belowOrEqual(1);
        scope.loadInPercent(-1000).should.be.aboveOrEqual(0).and.belowOrEqual(1);
        scope.loadInPercent(4).should.be.equal(1);
        scope.loadInPercent(1).should.be.equal(0.25);
    })
    it.only('$scope.setLoadCss(load) should return text-success when load % is [0,0.7)', function(){
        scope.$apply();
        scope.loadInPercent = function(){ return 0.5};
        scope.setLoadCss(2).should.be.equal("text-success");
        scope.loadInPercent = function(){ return 0.25};
        scope.setLoadCss(1).should.be.equal("text-success");
        scope.loadInPercent = function(){ return 1.0};
        scope.setLoadCss(4).should.not.be.equal("text-success");
        scope.loadInPercent = function(){ return -250.0};
        scope.setLoadCss(-300).should.not.be.equal("text-success");
        scope.loadInPercent = function(){ return 0.699};
        scope.setLoadCss(1).should.be.equal("text-success");
        scope.loadInPercent = function(){ return 0.7};
        scope.setLoadCss(1).should.not.be.equal("text-success");
    });
    it.only('$scope.setLoadCss(load) should return text-warning when load % is [0.7,0.8)', function(){
        scope.$apply();
        scope.loadInPercent = function(){return 0.7};
        scope.setLoadCss(1).should.be.equal("text-warning");
        scope.loadInPercent = function(){return 0.8};
        scope.setLoadCss(1).should.not.be.equal("text-warning");
        scope.loadInPercent = function(){return 0.756};
        scope.setLoadCss(1).should.be.equal("text-warning");
    });
    it.only('$scope.setLoadCss(load) should return text-danger when load % is [0.8,1] or greather than 1, smaller than 0', function(){
        scope.$apply();
        scope.loadInPercent = function(){return 0.8};
        scope.setLoadCss(1).should.be.equal("text-danger");
        scope.loadInPercent = function(){return 1.0};
        scope.setLoadCss(1).should.be.equal("text-danger");
        scope.loadInPercent = function(){return 1000.0};
        scope.setLoadCss(1).should.be.equal("text-danger");
        scope.loadInPercent = function(){return -1000.0};
        scope.setLoadCss(1).should.be.equal("text-danger");
        scope.loadInPercent = function(){return 0.05};
        scope.setLoadCss(1).should.not.be.equal("text-danger");
        scope.loadInPercent = function(){return 0.71};
        scope.setLoadCss(1).should.not.be.equal("text-danger");

        
    });
    it.only('should cancel $scope.timer on $destroy event', function(){
        scope.$apply();
        scope.info.uptime = 1;
        $interval.flush(2000);
        scope.info.uptime.should.be.equal(3);
        scope.timer.should.be.ok();
        scope.$emit('$destroy');
        $interval.flush(2000);
        scope.info.uptime.should.be.equal(3);
        should(scope.timer).be.equal(undefined);
    })
});
