module.exports = ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    $scope.refresh = function () {
        $http.get('/api/bitcoind/getpeerinfo').then(function (res) {
            $scope.peers = res.data;
        });
    };
    var timer;
    $http.get('api/bitcoind/status').then(function (res) {
        $scope.info = res.data;
        if (!angular.isDefined(timer)) {
            timer = $interval(function () {
                $scope.info.uptime += 1; //we add 1 second to uptime to fake it is live
            }, 1000);
        }
    });
    $scope.refresh();
    $scope.$on("$destroy", function () {
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
            timer = undefined;
        }
    });
}];