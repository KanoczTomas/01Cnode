var angular = require("angular");
var app = angular.module("filter.secondsToDateTime", [])

app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(1970, 0, 1).setSeconds(seconds);
    };
}])

module.exports = app;

//code from http://stackoverflow.com/questions/28394572/angularjs-seconds-to-time-filter