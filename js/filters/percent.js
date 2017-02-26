var angular = require("angular");

var app = angular.module("filter.percent", []);

app.filter("percent", function(){
    return function(value){
        return (value * 100).toFixed(2) + '%';
    }
});

module.exports = app;