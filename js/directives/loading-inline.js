var angular = require("angular");

var app = angular.module("directive.loading-inline",[]);

app.directive('loading-inline',   ['$http' ,function ($http)
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
            console.log("loading-inline fired");
        },
        template: "<span class=\"loader-dots text-center\">Loading <span>.</span><span>.</span><span>.</span></span>"
    };
}]);
module.exports = app;