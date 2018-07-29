'use strict';

module.exports = [ '$scope', '$http', '$interval', 'apiUrlStart', 'getInfoSrv', function($scope, $http, $interval, apiUrlStart, getInfoSrv){

    var n = 10;
    $scope.blocks = [];

    function loadLatestBlocks(n){
        $http.get(apiUrlStart + "/getblockcount")
        .then(function(res){
            $scope.blockCount = res.data;
            for(var i=$scope.blockCount; i > $scope.blockCount - n; i--){
                $http.get(apiUrlStart + "/getblockhash/" + i)
                .then(function(res){
                    var hash = res.data
                    return $http.get(apiUrlStart + "/getblock/" + hash);
                })
                .then(function(res){
                    var block = res.data;
                    block.time = block.time * 1000;
                    $scope.blocks.push(block);
                    window.blocks = $scope.blocks.slice();
                })
            }
        }
	,function(error){
	  $scope.blocks = error;
	});
    }
    loadLatestBlocks(n);




    function loadBlock(){
        $http.get(apiUrlStart + "/getblockchaininfo")
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
