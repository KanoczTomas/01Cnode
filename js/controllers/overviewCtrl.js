module.exports = ['$scope', '$http', function($scope, $http){
  
  $scope.refresh = function(){
      $http.get('/api/bitcoind/getpeerinfo')
      .then(function(res){
        $scope.peers = res.data;
      });
  };
  $http.get('api/bitcoind/status')
  .then(function(res){
  	$scope.info = res.data;
  });
  $scope.refresh();
}];
