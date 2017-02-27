var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.filter("percent", function(){
    return function(value){
        return (value * 100).toFixed(2) + '%';
    }
});