var angular = require('angular');
var app = angular.module('controller.indexCtrl', []);

app.controller('indexCtrl', ['$scope', 'getInfoSrv', function ($scope, getInfoSrv) {
    getInfoSrv.then(function(info){  
        $scope.testnet = info.testnet;
        $scope.pageName = info.pageName;
    });
}]);
module.exports = app;