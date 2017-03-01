'use strict';
require("cache-require-paths");

var config = require("config");
var should = require("should");
require("../angular-helper");
require("../../../js/app.js");

describe('overviewCtrl', function(){
    var $httpBackend, $rootScope, createController, requestHandler, state = "overview", $state;
    
    beforeEach(ngModule(config.get('Client.appName')));
    beforeEach(inject(function ($injector){
        $httpBackend = $injector.get('$httpBackend');
        $httpBackend.when('GET', config.get('Client.apiUrlStart') + '/getinfo')
        .respond(200,[
            {
                "id": 2,
                "addr": "159.8.86.189:18333",
                "addrlocal": "217.12.62.213:59326",
                "version": 70015,
                "subver": "/Satoshi:0.13.1/",
                "inbound": false,
            },
            {
                "id": 4,
                "addr": "127.0.0.1:18333",
                "addrlocal": "217.12.62.213:59329",
                "version": 70015,
                "subver": "/Satoshi:0.13.2/",
                "inbound": true,
            }
            
        ]);
        $httpBackend.when('GET', config.get('Client.apiUrlStart') + '/status')
        .respond(200,[
            {
            "arch": "arm",
            "cpus": [
                {
                "model": "ARMv7 Processor rev 4 (v7l)",
                }
            ],
            "freemem": 120983552,
            "uptime": 58465,
            "totalmem": 1020366848,
            "platform": "linux",
            "hostname": "raspbinode",
            "networkInterfaces": {
                "lo": [
                    {
                    "address": "127.0.0.1",
                    "netmask": "255.0.0.0",
                    "family": "IPv4",
                    "mac": "00:00:00:00:00:00",
                    "internal": true
                    },
                    {
                    "address": "::1",
                    "netmask": "ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff",
                    "family": "IPv6",
                    "mac": "00:00:00:00:00:00",
                    "scopeid": 0,
                    "internal": true
                    }
                ],
                "wlan0": [
                    {
                    "address": "192.168.2.140",
                    "netmask": "255.255.255.0",
                    "family": "IPv4",
                    "mac": "b8:27:eb:81:b9:3a",
                    "internal": false
                    },
                    {
                    "address": "fe80::c46c:711a:e50c:9e36",
                    "netmask": "ffff:ffff:ffff:ffff::",
                    "family": "IPv6",
                    "mac": "b8:27:eb:81:b9:3a",
                    "scopeid": 3,
                    "internal": false
                    }
                ],
            },
            "loadavg": [
                0.27978515625,
                0.10009765625,
                0.02490234375
            ],
            "blockchainSize": 11567391398
            }             
        ]);
        $rootScope = $injector.get('$rootScope');
        $state = $injector.get('$state');
        var $templateCache = $injector.get('$templateCache');
        $templateCache.put('/templates/overview.html', '');
        
        var $controller = $injector.get('$controller');
        createController = function(){
            return $injector.instantiate($state.get(state).controller,{
                "$scope": $rootScope.$new()
            });
        };
        
    }));
    
        
    afterEach(function(){
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    
    it.only('state should be overview', function(){
        $state.go(state);
        $rootScope.$digest();
        $state.current.name.should.be.equal(state);
    });
    it.only('should GET ' + config.get('Client.apiUrlStart') + '/status then ' + config.get('Client.apiUrlStart') + '/getpeerinfo' , function(){
        var controller = createController();
	$httpBackend.expectGET(config.get('Client.apiUrlStart') + '/status').respond(200);
	$httpBackend.expectGET(config.get('Client.apiUrlStart') + '/getpeerinfo').respond(200);
        $httpBackend.flush();        
    });
})
