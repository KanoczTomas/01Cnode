'use strict';

module.exports = [ "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/overview");

	$stateProvider
	.state("overview", {
		url: "/overview",
		templateUrl: "/templates/overview.html",
		controller: require("./controllers/overviewCtrl"),
        controllerAs: "overviewCtrl"
	})
	.state("mempool", {
		url: "/mempool",
		templateUrl: "/templates/mempool.html",
        controller: require("./controllers/mempoolCtrl")
	})
	.state("blockexplorer", {
		url: "/blockexplorer",
		templateUrl: "/templates/blockexplorer.html",
		controller: require("./controllers/blockExplorerCtrl")
	})
    .state("txexplorer", {
		url: "/txexplorer",
		templateUrl: "/templates/txexplorer.html",
		controller: require("./controllers/txexplorerCtrl")
	})
    .state("about", {
		url: "/about",
		templateUrl: "/templates/about.html"//,
		//controller: require("./controllers/about")
	});
}];
