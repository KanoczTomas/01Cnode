'user strict';

var config = require("config");
var should = require("should");
var util = require("util");
var EventEmitter = require("events");
require("../angular-helper");
require("../../../js/app.js")

function SocketIO(){
    EventEmitter.call(this);
}

util.inherits(SocketIO, EventEmitter);


describe('mempoolCtrl', function(){
    var $httpBackend, $rootScope, createController, state = "mempool", $state;
    var scope;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(ngModule(function($provide){
        $provide.factory('socketio', function(){
            return new SocketIO();
        });
//        $provide.value('$location', {
//            url: function(){}
//        });//had to mock $location, otherwise the tests were throwing $digest errors
        // see http://stackoverflow.com/questions/27383531/unit-tests-fail-with-digest-iterations-loop-after-update-to-1-3-4
    }));
    
    beforeEach(inject(function ($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $state = $injector.get('$state');
        $state.go(state);//we have to go to the state as it is not jumped to automatically, the overview state is the default
        var $templateCache = $injector.get('$templateCache');
        $templateCache.put('/templates/mempool.html', '');
        scope = $rootScope.$new();
        createController = function(scope){
            return $injector.instantiate($state.get(state).controller,{
                "$scope": scope
            });
        };
        createController(scope);
        
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/getmempoolinfo')
        .respond({
           size: 1000
        });
        $httpBackend.flush();//when called all $http.get methods fire in the controller and return mocked responses
    }));
    
        
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it.only('should GET ' + config.get('Client.apiUrlStart') + '/getmempoolinfo', function(){
        //all handled in before hooks
    });
    
    it.only('state should be mempool', function(){
        $state.current.name.should.be.equal(state);
    });
    it.only('$scope.loadMempool should fetch ' + config.get('Client.apiUrlStart') + '/getmempoolinfo', function(){
        scope.loadMempool();
        $httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getmempoolinfo');
        scope.loadMempool();
        $httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getmempoolinfo');
        $httpBackend.flush();
    });
    it.only('$scope.txes should be an Array', function(){
        scope.txes.should.be.Array();
    });
    it.only('$scope.showN should be a Number', function(){
        scope.showN.should.be.a.Number();
    });
    it.only('$scope.setCSSanimation() should return empty string when index out of range', function(){
    
        scope.setCSSanimation(11).should.be.equal('');
        scope.setCSSanimation(-5).should.be.equal('');
        scope.showN = 20;
        scope.setCSSanimation(11).should.not.be.equal('');
    });
    it.only('$scope.setCSSanimation() should return fade-in if index is [0,$scope.showN)', function(){
        scope.showN = 3;
        scope.setCSSanimation(0).should.be.equal('fade-in');
        scope.setCSSanimation(1).should.be.equal('fade-in');
        scope.setCSSanimation(2).should.be.equal('fade-in');
        scope.setCSSanimation(3).should.not.be.equal('fade-in');
        scope.setCSSanimation(4).should.not.be.equal('fade-in');
        
    });
    
    //do more tests for poping when there are showN+1 elements, not poping when there are less, etc.
});

























