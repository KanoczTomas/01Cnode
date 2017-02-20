module.exports = ['$scope', '$http', '$interval', function ($scope, $http, $interval) {
    function loadMempool() {
        //$http.get("/api/bitcoind/getrawmempool")
        $http.get("/api/bitcoind/getmempoolinfo").then(function (res) {
            $scope.mempoolEntries = res.data;
        });
    }
    loadMempool();
    if (!angular.isDefined(timer)) {
        var timer = $interval(function () {
            loadMempool();
        }, 2000);
    }
    $scope.$on("$destroy", function () {
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
            timer = undefined;
        }
    });
}];