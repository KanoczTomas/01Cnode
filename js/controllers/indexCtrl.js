'use strict';

var angular = require('angular');
var config = require("config");

angular.module(config.get('Client.appName'))
.controller('indexCtrl', ['$scope', 'getInfoSrv', function ($scope, getInfoSrv) {
    getInfoSrv.then(function(info){  
        $scope.testnet = info.testnet;
        $scope.pageName = info.pageName;
    });
}]);