module.exports = ['$scope', '$http', function($scope, $http){
  
  $scope.refresh = function(){
      $http.get('/api/bitcoind/getpeerinfo')
      .then(function(res){
        console.log(res);
        $scope.peers = res.data;
      });
  };
  $scope.refresh();
}];
