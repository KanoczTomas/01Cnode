module.exports = [ "$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise("/overview");

	$stateProvider
	.state("overview", {
		url: "/overview",
		template: "here will be an overview with nodes"
	});
}];
