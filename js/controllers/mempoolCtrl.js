module.exports = ['$scope', '$http', '$interval', '$timeout', 'socketio', function ($scope, $http, $interval, $timeout, socketio) {
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
    $scope.txes = [];
    $scope.showN = 10;
    
    $scope.setCSSanimation = function(index){
        if(index === $scope.showN) return "fade-out";
        else return "fade-in";
    }
    
    function countBTCsent(tx){
        if(tx === null || tx === undefined) return;
        var sum = 0;
        console.log(tx);
        tx.vout.forEach(function(vout){
            sum += vout.value;
        })
        return sum.toFixed(8);
    }
    
    socketio.on('hashtx', function(data){
        $scope.mempoolEntries.size += 1;
        $http.get('api/bitcoind/getrawtransaction/' + data.data)
        .then(function(res){
            res.data.totalSent = countBTCsent(res.data);
            if($scope.txes.length > $scope.showN) $scope.txes.pop();    
            $scope.txes.unshift(res.data);
        });
    });
    socketio.on('hashblock', function(data){
        loadMempool();
    });
    
}];