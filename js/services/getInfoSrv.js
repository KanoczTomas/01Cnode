'use strict';

var angular = require('angular');
var config = require('config');

angular.module(config.get("Client.appName"))
.factory('getInfoSrv', ['$http', 'apiUrlStart', '$q',  function ($http, apiUrlStart, $q) {
    var nullObject = Object.create(null);//used at currying as best practice
    var info = {
        chain: null,
        blocks: null,
        synced: null,
        pageName: config.get('Client.pageName'),
        version: null,
        initialised: false,
        error: {
            fetchBlockChainInfo: false,
            fetchNetworkInfo: false,
            message: null
        },
        initialise: function(){
            return initialise.apply(nullObject, [true, true])
        },
        fetchBlockChainInfo: function(){
            return initialise.apply(nullObject, [true, false])
        },
        fetchNetworkInfo: function(){
            return initialise.apply(nullObject, [false, true])
        }
    };
    function initialise(fetchBlockChainInfo, fetchNetworkInfo){
        var workQueue = [];
        if (info.initialised) return Promise.resolve(info.initialised);
        if(fetchBlockChainInfo){
            workQueue.push(
                $http.get(apiUrlStart + '/getblockchaininfo')
                .then(function (res){
                    info.chain = res.data.chain;
                    if(res.data.blocks === res.data.headers){
                        info.synced = true;
                    }
                    else info.synced = false;
                }, function (err){
                    info.error.fetchBlockChainInfo = true;
                    info.error.message = err;
                })
            );
        }
        if(fetchNetworkInfo){
            workQueue.push(
                $http.get(apiUrlStart + '/getnetworkinfo')
                .then(function (res){
                    info.version = res.data.subversion.replace(/\//g,"");
                }, function (err){
                    info.error.fetchNetworkInfo = true;
                    info.error.message = err;
                })
            );
        }
        return Promise.all(workQueue).
        then(function(){
            if(fetchBlockChainInfo && fetchNetworkInfo) info.initialised = true;
            return info.initialised;
        });
    }
    return info;
}]);