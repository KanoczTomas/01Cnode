'use strict';
var config = require("config");
var should = require("should");
require("../angular-helper");
require("../../../js/app");


describe('service getInfoSrv', function(){
    var $httpBackend, getInfoSrv, $rootScope, scope, chain='main', blocks = 500, headers = 500, test;
    
    beforeEach(ngModule(config.get('Client.appName')));
    
    beforeEach(inject(function ($injector){
        $httpBackend = $injector.get('$httpBackend');
        $rootScope = $injector.get('$rootScope');
        scope = $rootScope.$new();
        getInfoSrv = $injector.get('getInfoSrv');
        
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/getblockchaininfo')
        .respond(200,{
            chain: 'main',
//            chain: setChainName(chain),
            blocks: 500,
//            blocks: setBlocks(blocks),
            headers: 500
//            headers: setHeaders(headers)
        });
        function setChainName(chain){
            return chain;
        }
        function setBlocks(blocks){
            return blocks;
        }
        function setHeaders(headers){
            return headers;
        }
        
        $httpBackend.whenGET(config.get('Client.apiUrlStart') + '/getnetworkinfo')
        .respond(200,{
            subversion: '/version without backslash/'
        });
        $httpBackend.flush();
        scope.$diget();
        
    }));
    
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should return an object', function(){
        getInfoSrv.should.be.an.Object();
    });
    it('should initialise correctly', function(){
        
        return getInfoSrv.initialise
        .then(function (init){
            init.should.be.true();
            getInfoSrv.should.be.eql({
                chain: 'main',
                blocks: 500,
                synced: true,
                pageName: config.get('Client.pageName'),
                version: 'version without backslash',
                error: {
                    fetchBlockChainInfo: false,
                    fetchNetworkInfo: false,
                    message: null
                }
            });
        });

    });
    
});