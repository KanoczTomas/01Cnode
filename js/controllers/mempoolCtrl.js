var bjs = require("bitcoinjs-lib");

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

    $scope.log = [];
    $scope.txes = [];
    $scope.showN = 10;
    
    $scope.setCSSanimation = function(index){
        if(index === $scope.showN) return "fade-out";
        else return "fade-in";
    }
    
    function countBTCsent(tx){
        if(tx === null || tx === undefined) return 0;
        var sum = 0;
        tx.vout.forEach(function(vout){
            sum += vout.value;
        })
        return sum.toFixed(8);
    }

    socketio.on('rawtx', rawtxListener);
    function rawtxListener(data){
        var tx = bjs.Transaction.fromHex(data.data);
        tx.totalSent = 0;
        tx.txid = tx.getId();
        tx.outs.forEach(function(out){
            tx.totalSent += out.value;
        })
        tx.totalSent = (tx.totalSent/100000000).toFixed(8); //we convert satoshi to BTC
        $scope.mempoolEntries.size += 1;
        if($scope.txes.length > $scope.showN) $scope.txes.pop();    
        $scope.txes.unshift(tx);
        console.log('rawtxListener fired');
        
    }
    
    socketio.on('hashblock', hashblockListerner);
    function hashblockListerner(data){
        loadMempool();
    };
    
    $scope.$on("$destroy", function () {
        socketio.removeListener('hashblock', hashblockListerner);
        socketio.removeListener('rawtx', rawtxListener);
        if (angular.isDefined(timer)) {
            $interval.cancel(timer);
            timer = undefined;
        }
    });
    
    
}];