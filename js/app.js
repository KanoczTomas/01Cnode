'use strict';

require("angular");
require("@uirouter/angularjs");
var config = require("config");
var socketio = require("angular-socket-io");

var app = angular.module(config.get('Client.appName'),
  [ 'ui.router',
    'btford.socket-io'
  ]
);

require("./directives");
require("./controllers");
require("./filters");
require("./services");

app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));
