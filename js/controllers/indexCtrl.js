'use strict';

var angular = require('angular');
var config = require("config");

angular.module(config.get('Client.appName'))
.controller('indexCtrl', ['$scope', 'getInfoSrv', function ($scope, getInfoSrv) {
    $scope.regtest = false;
    $scope.main = false;
    $scope.testnet = false;
    $scope.synced = false;
    
    function setChain(chainName){//we set $scope.regtest or $scope.main or $scope.testnet to true then getInfoSrv resolves
        $scope[chainName] = true;
    }
    getInfoSrv.initialise()
    .then(function (init){
        setChain(getInfoSrv.chain);//info.chain has the chain name from getblockchaininfo
        $scope.pageName = getInfoSrv.pageName;
        $scope.synced = getInfoSrv.synced;
    });
//    getInfoSrv.then(function(info){
//        setChain(info.chain);//info.chain has the chain name from getblockchaininfo
//        $scope.pageName = info.pageName;
//        $scope.synced = info.synced;
//    });
}]);