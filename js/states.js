module.exports = [ "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/overview");

	$stateProvider
	.state("overview", {
		url: "/overview",
		templateUrl: "/templates/overview.html",
		controller: require("./controllers/overviewCtrl"),
		controllerAs: 'overviewCtrl'
	})
	.state("mempool", {
		url: "/mempool",
		templateUrl: "/templates/mempool.html"
	})
	.state("blockexplorer", {
		url: "/blockexplorer",
		templateUrl: "/templates/blockexplorer.html"
	});
}];
