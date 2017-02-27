'use strict';

var angular = require("angular");
var io = require("socket.io-client");
var config = require("config");

angular.module(config.get("Client.appName"))
.factory('socketio', ['socketFactory', function(socketFactory){
    var mySocket = io.connect('');
    return socketFactory({
        ioSocket: mySocket
    });  
}]);