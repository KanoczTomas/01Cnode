var angular = require("angular");

var app = angular.module("directive.loading",[]);

app.directive('loading',   ['$http' ,function ($http)
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
        template: "<div class=\"loader center-block\"></div><div class=\"text-center\">Loading ...</div>"
    };
}]);
module.exports = app;