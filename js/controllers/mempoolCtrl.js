'use strict';
var bjs = require("bitcoinjs-lib");
module.exports = ['$scope', '$http', 'socketio', 'apiUrlStart', function ($scope, $http, socketio, apiUrlStart) {
    function loadMempool() {
        $http.get(apiUrlStart + "/getmempoolinfo").then(function (res) {
            $scope.mempoolEntries = res.data;
        });
    }
    loadMempool();
    $scope.txes = [];
    $scope.showN = 10;
    $scope.setCSSanimation = function (index) {
        if (index === $scope.showN) return "fade-out";
        else return "fade-in";
    }
    socketio.on('rawtx', rawtxListener);

    function rawtxListener(data) {
        try {
            var tx = bjs.Transaction.fromHex(data.data);
        }
        catch (e) {
            console.log(e);
            console.log("probably a non standard tx - here is the dump of data: " + data.data);
            console.log('check agains bitcoind - this is a witness transaction')
            return;
        }
        tx.totalSent = 0;
        tx.txid = tx.getId();
        tx.outs.forEach(function (out) {
            tx.totalSent += out.value;
        })
        tx.totalSent = (tx.totalSent / 100000000).toFixed(8); //we convert satoshi to BTC
        $scope.mempoolEntries.size += 1;
        if ($scope.txes.length > $scope.showN) $scope.txes.pop();
        $scope.txes.unshift(tx);
    }
    socketio.on('hashblock', hashblockListerner);

    function hashblockListerner(data) {
        loadMempool();
    };
    $scope.$on("$destroy", function () {
        socketio.removeListener('hashblock', hashblockListerner);
        socketio.removeListener('rawtx', rawtxListener);
    });
}];