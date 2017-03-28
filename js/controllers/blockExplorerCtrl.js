'use strict';

module.exports = [ '$scope', '$http', '$interval', 'apiUrlStart', 'getInfoSrv', function($scope, $http, $interval, apiUrlStart, getInfoSrv){
    
    var n = 10;
    $scope.blocks = [];
    
    function loadLatestBlocks(n){
        $http.get(apiUrlStart + "/getblockcount")
        .then(function(res){
            $scope.blockCount = res.data;
            console.log("for(var i=" + $scope.blockCount + "; i > " + ($scope.blockCount - n) + "; i--)");
            for(var i=$scope.blockCount; i > $scope.blockCount - n; i--){
                console.log("i is " + i);
                console.log("blockCount is " + $scope.blockCount);
                $http.get(apiUrlStart + "/getblockhash/" + i)
                .then(function(res){
                    var hash = res.data
                    return $http.get(apiUrlStart + "/getblock/" + hash);
                })
                .then(function(res){
                    $scope.blocks.push(res.data);
                    console.log(res.data.length);
                    window.blocks = $scope.blocks.slice();
                })
            }
        })
    }
    loadLatestBlocks(n);
    console.log($scope.blocks);
    
    

    
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

