'use strict';
var bjs = require("bitcoinjs-lib");
module.exports = ['$scope', '$http', 'socketio', 'apiUrlStart', function ($scope, $http, socketio, apiUrlStart) {

    
    $scope.loadMempool = function() {
        $http.get(apiUrlStart + "/getmempoolinfo").then(function (res) {
            $scope.mempoolEntry = res.data;
        });
    };
    $scope.loadMempool();
    $scope.txes = [];
    $scope.showN = 10;
    $scope.setCSSanimation = function (index) {
        if(index < 0 || index > $scope.showN) return '';
        else if (index === $scope.showN) return "fade-out";
        else return "fade-in";
    }
    

    $scope.rawtxListener = function(data) {
        try {
            var tx = bjs.Transaction.fromHex(data.data);  
            window.tx = tx;
        }
        catch (e) {
            console.log(e);
            console.log("probably a non standard tx - here is the dump of data: " + data.data);
            console.log('check against bitcoind - this is a witness transaction')
            return;
        }
        
        tx.totalSent = 0;
        tx.txid = tx.getId();
        tx.outs.forEach(function (out) {
            tx.totalSent += out.value;
        })
        tx.totalSent = (tx.totalSent / 100000000).toFixed(8); //we convert satoshi to BTC
        if($scope.mempoolEntry)$scope.mempoolEntry.size += 1;
        if($scope.mempoolEntry)$scope.mempoolEntry.bytes += data.data.length/2; //we have bytes in hexa 2 digits = 1 B
        if ($scope.txes.length > $scope.showN) $scope.txes.pop();
        $scope.txes.unshift(tx);
    }
    
    socketio.on('rawtx', $scope.rawtxListener);
    
    $scope.hashblockListener = function(data) {
        $scope.loadMempool();
    };
    socketio.on('hashblock', $scope.hashblockListener);
    
    $scope.$on("$destroy", function () {
        socketio.removeListener('rawtx', $scope.rawtxListener);
        socketio.removeListener('hashblock', $scope.hashblockListener);
    });
    
}];