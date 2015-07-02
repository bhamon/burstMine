/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generatorPreset-create', [
	'$scope', '$q', '$http', '$modal', '$modalInstance', 'burstMine-config',
	function($scope, $q, $http, $modal, $modalInstance, p_config) {
		$scope.error = null;
		$scope.plugins = [];
		$scope.components = [];

		$scope.data = {
			name:'',
			description:'',
			plugin:null,
			component:null,
			params:{},
			plots:[]
		};

		$scope.clearError = function(p_error) {
			$scope.error = p_error;
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

			$http.get(p_config.apiPath + '/plugins/' + $scope.data.plugin.type + '/generators')
			.success(function(p_data) {
				p_data.forEach(function(p_component) {
					p_component.controller = 'burstMine-plugin-' + $scope.data.plugin.type + '-generator-' + p_component.type + '-edit';
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
					category:function() { return 'generator'; },
					component:function() { return $scope.data.component; }
				}
			});
		};

		$scope.save = function() {
			$scope.clearError();
			$scope.$broadcast('show-errors-check-validity');
			if(!$scope.formGeneratorPreset.$valid) {
				return;
			}

			var generatorPreset = {
				plugin:$scope.data.plugin.type,
				type:$scope.data.component.type,
				name:$scope.data.name,
				description:$scope.data.name,
				params:$scope.data.params
			};

			$http.post(p_config.apiPath + '/generatorPresets', generatorPreset)
			.success(function(p_data) {
				generatorPreset.id = p_data.id;
				$modalInstance.close(generatorPreset);
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