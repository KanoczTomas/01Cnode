'use strict';

var angular = require('angular');
var config = require('config');

angular.module(config.get("Client.appName"))
.factory('getInfoSrv', ['$http', 'apiUrlStart', '$q',  function ($http, apiUrlStart, $q) {
    var info = {};
    return $q.all([
        $http.get(apiUrlStart + '/getblockchaininfo'),
//        .then(function (res){
//            console.log('fired getblockchaininfo $http');
//            return Promise.resolve(res.data);
//        }),
        $http.get(apiUrlStart + '/getnetworkinfo')
//        .then(function (res){
//            console.log('fired getnetworkinfo $http');
//            return Promise.resolve(res.data);
//        })
    ])
    .then(function (res) {
        info.chain = res[0].data.chain;
        if(res[0].data.blocks === res[0].data.headers)
            info.synced = true;
        else info.synced = false;
        info.pageName = config.get('Client.pageName');
        info.version = res[1].data.subversion.replace(/\//g,"");
        return info;
    });
}]);
