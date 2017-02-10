module.exports = [ '$scope', '$http', '$interval', function($scope, $http, $interval){
    function loadMempool(){
        //$http.get("/api/bitcoind/getrawmempool")
        $http.get("/api/bitcoind/getinfo")
        .then(function(res){
            $scope.info= res.data;
        })
				.then(function(){
					return $http.get("/api/bitcoind/getblockhash/" + $scope.info.blocks);
				})
				.then(function(res){
					return	$http.get("api/bitcoind/getblock/" + res.data);
				})
				.then(function(res){
					$scope.block = res.data;
					$scope.block.time = new Date($scope.block.time * 1000);
				});
    }
    loadMempool();
		var timer = 1;
		if(!angular.isDefined(timer)){
			var timer = $interval(function(){
				loadMempool();
			}, 2000);
		}

		$scope.$on("$destroy", function(){
			if(angular.isDefined(timer)){
				$interval.cancel(timer);
				timer = undefined;
			}
		});
}];
