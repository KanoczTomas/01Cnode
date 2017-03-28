'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter("percent", function(){
    return function(value){
        if(typeof value !== 'number' || isNaN(value) || !isFinite(value)) return '-';
        else if(value < 0 || value > 1) return "-.--%";
        return (value * 100).toFixed(2) + '%';
    }
});