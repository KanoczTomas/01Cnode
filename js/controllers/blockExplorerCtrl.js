module.exports = [ '$scope', '$http', '$interval', 'apiUrlStart', 'getInfoSrv', function($scope, $http, $interval, apiUrlStart, getInfoSrv){
    function loadBlock(){
        $http.get(apiUrlStart + "/getinfo")
        .then(function(res){
            $scope.info= res.data;
        })
		.then(function(){
			return $http.get(apiUrlStart + "/getblockhash/" + $scope.info.blocks);
		})
		.then(function(res){
		  return	$http.get(apiUrlStart + "/getblock/" + res.data);
		})
		.then(function(res){
			$scope.block = res.data;
			$scope.block.time = new Date($scope.block.time * 1000);
		});
    }
    loadBlock();
}];

