module.exports = [ '$scope', '$http', function($scope, $http){
    function loadMempool(){
        $http.get("/api/bitcoind/getrawmempool")
        .then(function(res){
            $scope.mempoolEntries = res.data;
        });
    }
    loadMempool();
}];