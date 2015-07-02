/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generations', [
	'$scope', '$q', '$http', '$modal', 'burstMine-config',
	function($scope, $q, $http, $modal, p_config) {
		$scope.error = null;
		$scope.generations = [];

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.load = function() {
			var defer = $q.defer();
			$scope.clearError();

			$http.get(p_config.apiPath + '/generations')
			.success(function(p_data) {
				$scope.generations = p_data;
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
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-generation-edit.html',
				controller:'burstMine-dashboard-plotting-generation-create'
			});

			modal.result.then(function() {
				$scope.load();
			});
		};

		$scope.remove = function(p_generation) {
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-generation-remove.html',
				controller:'burstMine-dashboard-plotting-generation-remove',
				resolve:{
					generation:function() {
						return p_generation;
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