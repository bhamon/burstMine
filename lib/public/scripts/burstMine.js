angular
.module('burstMine', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.showErrors'])
.config([
	'$locationProvider', '$urlRouterProvider', '$stateProvider',
	function($locationProvider, $urlRouterProvider, $stateProvider) {
		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/home');

		$stateProvider
		.state('home', {
			url:'/home',
			templateUrl:'templates/burstMine-home.html'
		})
		.state('mines', {
			url:'/mines',
			templateUrl:'templates/burstMine-mines.html',
			controller:'burstMine-mines'
		})
		.state('mine', {
			abstract:true,
			url:'/mines/:mine',
			templateUrl:'templates/burstMine-mine.html',
			resolve:{
				mine:[
					'$q', '$http', '$stateParams', 'burstMine-config',
					function($q, $http, $stateParams, config) {
						var defer = $q.defer();

						$http.get(config.basePath + '/mines/' + $stateParams.mine)
						.success(function(p_data) {
							defer.resolve(p_data);
						})
						.error(function(p_error) {
							defer.reject(p_error);
						});

						return defer.promise;
					}
				]
			},
			controller:'burstMine-mine'
		})
		.state('mine.overview', {
			url:'/overview',
			templateUrl:'templates/burstMine-mine-overview.html',
			controller:'burstMine-mine-overview'
		})
		.state('settings', {
			url:'/settings',
			templateUrl:'templates/burstMine-settings.html',
			controller:'burstMine-settings'
		})
		.state('help', {
			url:'/help',
			templateUrl:'templates/burstMine-help.html'
		});
	}
])
.constant('burstMine-config', {
	basePath:'/api'
})
.run([
	'$rootScope', '$http', 'burstMine-config',
	function($rootScope, $http, config) {
		$http.get(config.basePath + '/status')
		.success(function(p_data) {
			$rootScope.version = p_data.version;
		});
	}
]);