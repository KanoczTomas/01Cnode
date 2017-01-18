module.exports = [ "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/overview");

	$stateProvider
	.state("overview", {
		url: "/overview",
		templateUrl: "/templates/overview.html"
	});
}];
