require("angular");
var config = require("config");
require("./directives");
require("./controllers/indexCtrl");
require("./filters");
require("./services");
require("./services/socket.io");

var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading',
    'directive.loadingInline',
    'controller.indexCtrl',
    'filter.secondsToDateTime',
    'filter.bytes',
    'filter.percent',
    'service.socket.io',
    'service.getInfoSrv'
  ]
);

app.config(require("./states"));
app.constant('apiUrlStart', config.get('Client.apiUrlStart'));