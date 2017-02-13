require("angular");
var config = require("config");
require("./directives/loading");
require("./directives/loadingInline");


var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router"),
    'directive.loading',
    'directive.loadingInline'
  ]
);
app.config(require("./states"));
