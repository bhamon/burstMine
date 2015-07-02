/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generation-create', [
	'$scope', '$q', '$http', '$modal', '$modalInstance', 'burstMine-config',
	function($scope, $q, $http, $modal, $modalInstance, p_config) {
		$scope.error = null;
		$scope.plugins = [];
		$scope.components = [];

		$scope.data = {
			plugin:null,
			component:null,
			params:{},
			plots:[],
			notification:{
				active:false,
				open:false,
				recipient:''
			}
		};

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.loadPlugins = function() {
			var defer = $q.defer();
			$scope.clearError();
			$scope.plugins = [];
			$scope.components = [];
			$scope.data.plugin = null;
			$scope.data.component = null;

			$http.get(p_config.apiPath + '/plugins')
			.success(function(p_data) {
				$scope.plugins = p_data;
				defer.resolve();
			})
			.error(function(p_data) {
				$scope.error = p_data;
				defer.reject(p_data);
			});


			return defer.promise;
		};

		$scope.loadComponents = function() {
			var defer = $q.defer();
			$scope.clearError();
			$scope.components = [];
			$scope.data.component = null;

			$http.get(p_config.apiPath + '/plugins/' + $scope.data.plugin.type + '/strategies')
			.success(function(p_data) {
				p_data.forEach(function(p_component) {
					p_component.controller = 'burstMine-plugin-' + $scope.data.plugin.type + '-strategy-' + p_component.type + '-edit';
					p_component.template = p_config.publicPath + p_config.plugins.publicPath + '/' + $scope.data.plugin.type + '/templates/' + p_component.controller + '.html';

					$scope.components.push(p_component);
				});

				defer.resolve();
			})
			.error(function(p_data) {
				$scope.error = p_data;
				defer.reject(p_data);
			});


			return defer.promise;
		};

		$scope.clearParams = function() {
			$scope.data.params = {};
		};

		$scope.pluginInfo = function() {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-plugin-info.html',
				controller:'burstMine-plugin-info',
				resolve:{
					plugin:function() {
						return $scope.data.plugin;
					}
				}
			});
		};

		$scope.componentInfo = function() {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-plugin-component-info.html',
				controller:'burstMine-plugin-component-info',
				resolve:{
					plugin:function() { return $scope.data.plugin; },
					category:function() { return 'strategy'; },
					component:function() { return $scope.data.component; }
				}
			});
		};

		$scope.addPlots = function() {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-plots-edit.html',
				controller:'burstMine-dashboard-plotting-plots-create'
			});

			modal.result.then(function(p_plots) {
				$scope.data.plots.push(p_plots);
			});
		};

		$scope.removePlots = function(p_plots) {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-plots-remove.html',
				controller:'burstMine-dashboard-plotting-plots-remove',
				resolve:{
					plots:function() {
						return p_plots;
					}
				}
			});

			modal.result.then(function() {
				var index = $scope.data.plots.indexOf(p_plots);
				if(index != -1) {
					$scope.data.plots.splice(index, 1);
				}
			});
		};

		$scope.enableNotification = function($event) {
			$event.stopPropagation();
			$event.preventDefault();
			if($scope.data.notification.active) {
				return;
			}

			$scope.data.notification.active = true;
			$scope.data.notification.open = true;
			$scope.data.notification.recipient = '';
		};

		$scope.disableNotification = function($event) {
			$event.stopPropagation();
			$event.preventDefault();
			$scope.data.notification.active = false;
			$scope.data.notification.open = false;
		};

		$scope.save = function() {
			$scope.clearError();
			$scope.$broadcast('show-errors-check-validity');
			if(!$scope.formGeneration.$valid || !$scope.data.plots.length) {
				return;
			}

			var generation = {
				plugin:$scope.data.plugin.type,
				type:$scope.data.component.type,
				params:$scope.data.params,
				plots:$scope.data.plots
			};

			if($scope.data.notification.active) {
				generation.notification = {
					recipient:$scope.data.notification.recipient
				};
			}

			$http.post(p_config.apiPath + '/generations', generation)
			.success(function(p_data) {
				generation.id = p_data.id;
				$modalInstance.close(generation);
			})
			.error(function(p_data) {
				$scope.error = p_data;
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};

		$scope.loadPlugins();
	}
]);