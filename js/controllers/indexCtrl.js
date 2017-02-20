var angular = require('angular');
var config = require('config');
var app = angular.module('controller.indexCtrl', []);

app.controller('indexCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/bitcoind/getinfo').then(function (res) {
        $scope.testnet = res.data.testnet;
    });
    $scope.pageName = config.get('Client.pageName');
}]);
module.exports = app;