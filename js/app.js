require("angular");
var config = require("config");
require("./directives/loading");
require("./directives/loadingInline");
require("./controllers/indexCtrl");
require("./filters/secondsToDateTime");
require("./filters/bytes");
require("./services/socket.io");



var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading',
    'directive.loadingInline',
    'controller.indexCtrl',
    'filter.secondsToDateTime',
    'filter.bytes',
    'service.socket.io'
  ]
);
app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));