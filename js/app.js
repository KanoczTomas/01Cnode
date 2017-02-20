require("angular");
var config = require("config");
require("./directives/loading");
require("./controllers/indexCtrl");
require("./filters/secondsToDateTime");


var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading',
    'controller.indexCtrl',
    'filter.secondsToDateTime'
  ]
);
app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));