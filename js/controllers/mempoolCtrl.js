module.exports = ['$scope', '$http', '$interval', 'socketio', function ($scope, $http, $interval,socketio) {
    function loadMempool() {
        //$http.get("/api/bitcoind/getrawmempool")
        $http.get("/api/bitcoind/getmempoolinfo").then(function (res) {
            $scope.mempoolEntries = res.data;
        });
    }
    loadMempool();
    var timer = 0;
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
    
    $scope.log = [];
    
    socketio.on('hashtx', function(data){
        $scope.mempoolEntries.size += 1;
        console.log(data);
    });
    socketio.on('hashblock', function(data){
        loadMempool();
        $scope.log.push("there was a new block at: " + new Date());
    });
    
}];