'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter('secondsToDateTime', function() {

    function padTime(t) {
        return t < 10 ? "0"+t : t;
    }
    
    function daysPlural(d){
        return d === 1 ? d + " day " : d + " days ";
    }

    return function(seconds) {
        if (typeof seconds !== "number" || seconds < 0 || isNaN(seconds) || !isFinite(seconds))
            return "00:00:00";

        var days = Math.floor(seconds / 86400),
	    hours = Math.floor((seconds % 86400) / 3600),
            minutes = Math.floor((seconds % 3600) / 60),
            seconds = Math.floor(seconds % 60);

        return daysPlural(days) + padTime(hours) + ":" + padTime(minutes) + ":" + padTime(seconds);
    };
});
//code from http://stackoverflow.com/questions/28394572/angularjs-seconds-to-time-filter