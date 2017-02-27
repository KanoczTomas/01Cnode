'use strict';

var angular = require("angular");
var config = require("config");
angular.module(config.get("Client.appName"))
.directive('loading',   ['$http' ,function ($http)
{
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                }
                else {
                    elm.hide();
                }
            });
        },
        template: "<div class=\"loader center-block\"></div><div class=\"loader-dots text-center\">Loading <span>.</span><span>.</span><span>.</span></div>"
    };
}]);