'use strict';
module.exports = ['$scope', '$http', 'socketio', 'apiUrlStart', function ($scope, $http, socketio, apiUrlStart) {


    $scope.loadMempool = function() {
        $http.get(apiUrlStart + "/getmempoolinfo").then(function (res) {
            $scope.mempoolEntry = res.data;
            $scope.mempoolEntry.fitsToHowManyBlocks = Math.ceil($scope.mempoolEntry.bytes/1000000);
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



    $scope.rawtxListener = function(tx) {
        if($scope.mempoolEntry)$scope.mempoolEntry.size += 1;
        if($scope.mempoolEntry)$scope.mempoolEntry.bytes += tx.byteLength;
        if($scope.mempoolEntry)$scope.mempoolEntry.fitsToHowManyBlocks = Math.ceil($scope.mempoolEntry.bytes/1000000);
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
