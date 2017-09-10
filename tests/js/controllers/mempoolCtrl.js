'user strict';

var config = require("config");
var should = require("should");
var util = require("util");
var EventEmitter = require("events");
var sinon = require("sinon");
var proxyquire = require("proxyquire");
require("../angular-helper");
proxyquire("../../../js/controllers/mempoolCtrl", { 
    'bitcoinjs-lib': {
        Transaction: {
            fromHex: function(data){
                return {
                    byteLength: function(){
                        return data.length/2;
                    },
                    getId: function(){
                        if(typeof data !== 'string') data = 'a unique id'
                        return data;
                    },
                    outs: [
                        {
                            value: 100000000
                        },
                        {
                            value: 300000000
                        },
                        {
                            value: 10
                        }
                    ]
                }
            }
        }
    }
});
require("../../../js/app");

function SocketIO(){ //we are mocking the socketio service
    EventEmitter.call(this);
}

util.inherits(SocketIO, EventEmitter);//we want it to have events


describe('mempoolCtrl', function(){
    var $httpBackend, $rootScope, createController, state = "mempool", $state;
    var scope, socketio;
    
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
        socketio = $injector.get('socketio');
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
            size: 1000,
            bytes: 20
        });
        $httpBackend.flush();//when called all $http.get methods fire in the controller and return mocked responses
    }));
    
        
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should GET ' + config.get('Client.apiUrlStart') + '/getmempoolinfo', function(){
        //all handled in before hooks
    });
    
    it('state should be mempool', function(){
        $state.current.name.should.be.equal(state);
    });
    it('$scope.loadMempool should fetch ' + config.get('Client.apiUrlStart') + '/getmempoolinfo', function(){
        scope.loadMempool();
        $httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getmempoolinfo');
        scope.loadMempool();
        $httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getmempoolinfo');
        $httpBackend.flush();
    });
    it('$scope.txes should be an Array', function(){
        scope.txes.should.be.Array();
    });
    it('$scope.showN should be a Number', function(){
        scope.showN.should.be.a.Number();
    });
    it('$scope.setCSSanimation() should return empty string when index out of range', function(){
    
        scope.setCSSanimation(11).should.be.equal('');
        scope.setCSSanimation(-5).should.be.equal('');
        scope.showN = 20;
        scope.setCSSanimation(11).should.not.be.equal('');
    });
    it('$scope.setCSSanimation() should return fade-in if index is [0,$scope.showN)', function(){
        scope.showN = 3;
        scope.setCSSanimation(0).should.be.equal('fade-in');
        scope.setCSSanimation(1).should.be.equal('fade-in');
        scope.setCSSanimation(2).should.be.equal('fade-in');
        scope.setCSSanimation(3).should.not.be.equal('fade-in');
        scope.setCSSanimation(4).should.not.be.equal('fade-in');
    });
    it('$scope.rawtxListener() should be called when rawtx event received', function(){
        socketio.removeListener('rawtx', scope.rawtxListener);//we remove the original method as it is bound undecorated to socketio
        var rawtxListener = sinon.spy(scope, 'rawtxListener');//we decorate the rawtxListener with a spy
        socketio.on('rawtx', rawtxListener);//we reattach the listener to the event
        socketio.emit('rawtx', {data: 'some strange data'});
        socketio.emit('rawtx', {data: 'some strange data'});
        sinon.assert.calledTwice(rawtxListener);
        sinon.assert.calledWith(rawtxListener, {data: 'some strange data'});
        scope.mempoolEntry.size.should.be.equal(1002);
        rawtxListener.restore();
    });
    it('should not pop transactions from Array tx until there are showN+1 elements', function(){
        scope.txes.length.should.be.equal(0);
        var data = {data: 'test'};
        for(var i = 0; i<scope.showN+1;i++){
            scope.rawtxListener(data);    
            scope.txes.length.should.be.equal(i+1);
        }
        scope.rawtxListener(data);
        scope.rawtxListener(data);
        scope.txes.length.should.be.equal(scope.showN+1);
    });
    it('should count the total value sent in transactions', function(){
        var data = {data: 'test'};
        scope.rawtxListener(data);
        scope.txes[0].totalSent.should.be.equal('4.00000010');
    });
    it('should increase $scope.mempoolEntry.size by one when rawtx event received and $scope.mempoolEntry.bytes by tx bytes', function(){
        scope.mempoolEntry.size.should.be.equal(1000);
        scope.rawtxListener({data: '0102'});
        scope.rawtxListener({data: '010203040506'});
        scope.rawtxListener({data: '010203040506070809AA'});
        scope.mempoolEntry.size.should.be.equal(1003);
        scope.mempoolEntry.bytes.should.be.equal(38);
        scope.mempoolEntry.fitsToHowManyBlocks.should.be.equal(1);
        
    });
    it('txid property of tx within $scope.rawtxListener should be set correctly', function(){
        scope.rawtxListener({data: 'test'});
        scope.txes[0].txid.should.be.equal('test');
        
    });
    it('transaction on a rawtx event should go to position 0', function(){
        scope.txes.length.should.be.equal(0);
        scope.rawtxListener({data: 'id 1'});
        scope.txes[0].txid.should.be.equal('id 1');
        scope.rawtxListener({data: 'id 2'});
        scope.txes[0].txid.should.be.equal('id 2');
        scope.txes[1].txid.should.not.be.equal('id 2');
        
    });
    it('should call $scope.loadMempool() when hashblock event received', function(){
        var loadMempool = sinon.stub(scope, "loadMempool").returns(true);
        socketio.emit('hashblock', 'data');
        sinon.assert.calledOnce(loadMempool);
        socketio.emit('hashblock', 'data');
        sinon.assert.calledTwice(loadMempool);
        loadMempool.calledThrice.should.be.false();
        loadMempool.restore();
    });
    it('should remove rawtx listener once $destroy event received on $scope', function(){
        socketio.removeListener('rawtx', scope.rawtxListener);
        var rawtxListener = sinon.spy(scope, "rawtxListener");
        socketio.on('rawtx', scope.rawtxListener);
        socketio.emit('rawtx', {data: 'test'});
        sinon.assert.calledOnce(rawtxListener);
        scope.$emit('$destroy');
        socketio.emit('rawtx', {data: 'test'});
        sinon.assert.calledOnce(rawtxListener);
        rawtxListener.restore();
    });
    it('should remove hashblock listener once $destroy event received on $scope', function(){
        socketio.removeListener('hashblock', scope.hashblockListener);
        var hashblockListener = sinon.spy(scope, 'hashblockListener');
        var loadMempool = sinon.stub(scope, 'loadMempool').returns(true);
        socketio.on('hashblock', scope.hashblockListener);
        socketio.emit('hashblock');
        sinon.assert.calledOnce(hashblockListener);
        scope.$emit('$destroy');
        socketio.emit('hashblock');
        sinon.assert.calledOnce(hashblockListener);
        hashblockListener.restore();
        loadMempool.restore();
    });
});

























