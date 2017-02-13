var angular = require("angular");

var app = angular.module("directive.loadingInline",[]);

app.directive('loadingInline',   ['$http' ,function ($http)
{
    console.log("loading-inline fired");
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
module.exports = app;
