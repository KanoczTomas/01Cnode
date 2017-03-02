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
            var socketio = new SocketIO();
            socketio.emit('rawtx', 'txid bla bla');
            socketio.emit('rawtx', 'txid bla bla');
            return socketio;
        })
    }));
    
    beforeEach(inject(function ($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        $state = $injector.get('$state');
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
//        scope.$apply();
        
    }));
    
        
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it.only('should GET ' + config.get('Client.apiUrlStart') + '/getmempoolinfo', function(){
        //all handled in before hooks
    });
    
    it('state should be mempool', function(){
        $state.go(state);
        $state.current.name.should.be.equal(state);
    })
});