var angular = require('angular');
var config = require('config');
var app = angular.module('service.getInfoSrv', []);

app.factory('getInfoSrv', ['$http', 'apiUrlStart', function ($http, apiUrlStart) {
    return $http.get(apiUrlStart + '/getinfo')
    .then(function (res) {
        var info = {};
        info.testnet = res.data.testnet;
        info.pageName = config.get('Client.pageName');    
        return info;
    });
}]);
module.exports = app;