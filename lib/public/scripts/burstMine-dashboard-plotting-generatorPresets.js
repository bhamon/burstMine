/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generatorPresets', [
	'$scope', '$q', '$http', '$modal', 'burstMine-config',
	function($scope, $q, $http, $modal, p_config) {
		$scope.error = null;
		$scope.generatorPresets = [];

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.load = function() {
			var defer = $q.defer();
			$scope.clearError();

			$http.get(p_config.apiPath + '/generatorPresets')
			.success(function(p_data) {
				$scope.generatorPresets = p_data;
				defer.resolve();
			})
			.error(function(p_data) {
				$scope.error = p_data;
				defer.reject(p_data);
			});

			return defer.promise;
		};

		$scope.create = function() {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-generatorPreset-edit.html',
				controller:'burstMine-dashboard-plotting-generatorPreset-create'
			});

			modal.result.then(function() {
				$scope.load();
			});
		};

		$scope.benchmark = function(p_generatorPreset) {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-generatorPreset-benchmark.html',
				controller:'burstMine-dashboard-plotting-generatorPreset-benchmark',
				resolve:{
					generatorPreset:function() {
						return p_generatorPreset;
					}
				}
			});
		};

		$scope.remove = function(p_generatorPreset) {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-generatorPreset-remove.html',
				controller:'burstMine-dashboard-plotting-generatorPreset-remove',
				resolve:{
					generatorPreset:function() {
						return p_generatorPreset;
					}
				}
			});

			modal.result.then(function() {
				$scope.load();
			});
		};

		$scope.load();
	}
]);