/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine', ['ui.router', 'ui.bootstrap', 'ui.bootstrap.showErrors', 'ui.util'])
.constant('burstMine-config', {
	publicPath:'/public',
	apiPath:'/api',
	plugins:{
		apiPath:'/plugins',
		publicPath:'/plugins'
	},
	refreshInterval:5000
})
.config([
	'$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$locationProvider', '$urlRouterProvider', '$stateProvider', 'burstMine-config',
	function($controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider, $urlRouterProvider, $stateProvider, p_config) {
		// TODO: kind of ugly...
		angular.module('burstMine').register = {
			controller:$controllerProvider.register,
			directive:$compileProvider.directive,
			filter:$filterProvider.register,
			factory:$provide.factory,
			service:$provide.service
		};

		$locationProvider.html5Mode(true);
		$urlRouterProvider.otherwise('/');

		$stateProvider
		.state('home', {
			url:'/',
			templateUrl:p_config.publicPath + '/templates/burstMine-home.html',
			controller:'burstMine-home'
		})
		.state('dashboard', {
			abstract:true,
			url:'/dashboard',
			templateUrl:p_config.publicPath + '/templates/burstMine-dashboard.html'
		})
		.state('dashboard.overview', {
			url:'/overview',
			templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-overview.html',
			controller:'burstMine-dashboard-overview'
		})
		.state('dashboard.plotting', {
			url:'/plotting',
			templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting.html',
			controller:'burstMine-dashboard-plotting'
		})
		.state('dashboard.mining', {
			url:'/mining',
			templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-mining.html',
			controller:'burstMine-dashboard-mining'
		})
		.state('settings', {
			url:'/settings',
			templateUrl:p_config.publicPath + '/templates/burstMine-settings.html'
		})
		.state('help', {
			url:'/help',
			templateUrl:p_config.publicPath + '/templates/burstMine-help.html'
		});
	}
])
.run([
	'$rootScope', '$q', '$http', 'burstMine-config',
	function($rootScope, $q, $http, p_config) {
		$rootScope.global = {
			status:null
		};

		var loadStatus = function() {
			var defer = $q.defer();

			$http.get(p_config.apiPath + '/status')
			.success(function(p_data) {
				$rootScope.global.status = p_data;
				defer.resolve();
			})
			.error(function(p_data) {
				defer.reject(p_data);
			});

			return defer.promise;
		};

		var loadScript = function(p_path) {
			var defer = $q.defer();

			$http.get(p_path)
			.success(function(p_data) {
				var bootstrap = new Function('$q', 'context', p_data);

				defer.resolve(bootstrap.call(bootstrap, $q, {
					addController:function(p_name, p_controller) {
						angular.module('burstMine').register.controller(p_name, p_controller);
					},
					addDirective:function(p_name, p_directive) {
						angular.module('burstMine').register.directive(p_name, p_directive);
					},
					addPluginScript:function(p_plugin, p_script) {
						return loadScript(p_config.publicPath + p_config.plugins.publicPath + '/' + p_plugin + '/scripts/' + p_script);
					},
					addPluginMenuItem:function(p_plugin, p_template) {
						$rootScope.menuItems.push(p_config.publicPath + p_config.plugins.publicPath + '/' + p_plugin + '/templates/' + p_template);
					}
				}));
			})
			.error(function(p_data) {
				defer.reject(p_data);
			});

			return defer.promise;
		};

		var loadPlugins = function() {
			var defer = $q.defer();

			$http.get(p_config.apiPath + '/plugins')
			.success(function(p_data) {
				var promises = [];
				p_data.forEach(function(p_plugin) {
					var bootstrap = p_config.publicPath + p_config.plugins.publicPath + '/' + p_plugin.type + '/scripts/burstMine-plugin-' + p_plugin.type + '.js'
					promises.push(loadScript(bootstrap));
				});

				return $q.all(promises)
				.then(function() {
					defer.resolve();
				});
			})
			.error(function(p_data) {
				defer.reject(p_data);
			});

			return defer.promise;
		};

		$rootScope.onComplete = loadStatus()
		.then(function() {
			return loadPlugins();
		});
	}
]);