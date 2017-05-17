'use strict';

module.exports = [ '$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart){
    $scope.transaction = {};
    $scope.search = function search(txid){
        //$scope.transaction.txid = txid;
        $http.get(apiUrlStart + '/getrawtransaction/' + txid) 
        .then(function success(res){
            $scope.transaction.data = res.data;
        });
    }
    
    
    
    
}];