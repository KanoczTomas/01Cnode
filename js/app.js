require("angular");
var config = require("config");

var app = angular.module(config.get('Client.appName'),
  [ require("angular-ui-router")
  ]
);
app.config(require("./states"));
