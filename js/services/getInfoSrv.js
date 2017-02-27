var angular = require('angular');
var config = require('config');
angular.module(config.get("Client.appName"))
.factory('getInfoSrv', ['$http', 'apiUrlStart', function ($http, apiUrlStart) {
    return $http.get(apiUrlStart + '/getinfo')
    .then(function (res) {
        var info = {};
        info.testnet = res.data.testnet;
        info.pageName = config.get('Client.pageName');    
        return info;
    });
}]);