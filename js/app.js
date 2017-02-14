require("angular");
var config = require("config");
require("./directives/loading");


var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading'
  ]
);
app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));