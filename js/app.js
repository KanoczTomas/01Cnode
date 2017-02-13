require("angular");
var config = require("config");
require("./directives/loading");
require("./directives/loading-inline");


var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading',
    'directive.loading-inline'
  ]
);
app.config(require("./states"));