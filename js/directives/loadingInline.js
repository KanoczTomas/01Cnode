'use strict';

var angular = require("angular");
var config = require("config");

angular.module(config.get("Client.appName"))
.directive('loadingInline',   ['$http' ,function ($http)
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
        template: "<span class=\"loader-dots text-center text-info\">Loading <span>.</span><span>.</span><span>.</span></span>"
    };
}]);
