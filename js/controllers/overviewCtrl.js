'use strict';

module.exports = ['$scope', '$http', '$interval', 'apiUrlStart', function ($scope, $http, $interval, apiUrlStart) {
        $scope.refresh = function () {
            $http.get(apiUrlStart + '/getpeerinfo').then(function (res) {
                $scope.peers = res.data;
            });
        };
        $scope.timer = undefined;
        $http.get(apiUrlStart + '/status').then(function (res) {
            $scope.info = res.data;
            if (!angular.isDefined($scope.timer)) {
                $scope.timer = $interval(function () {
                    $scope.info.uptime += 1; //we add 1 second to uptime to fake it is live
                }, 1000);
            }
            $scope.loadInPercent = function(load){
                var maxLoad = 1.0 * $scope.info.cpus.length;
                var result = load/maxLoad;
                if(result > 1) return 1.0;
                else if(result <0) return 0.0;
                else return result;
            };

            $scope.setLoadCss = function(load){
                var percent = $scope.loadInPercent(load);
                if(percent >= 0.0 && percent < 0.7) return "text-success";
                else if(percent >= 0.7 && percent < 0.8) return "text-warning";
                else return "text-danger";
            };

        });

        $scope.refresh();
        $scope.$on("$destroy", function () {
            if (angular.isDefined($scope.timer)) {
                $interval.cancel($scope.timer);
                $scope.timer = undefined;
            }
        });
}];