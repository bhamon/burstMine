/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generatorPreset-benchmark', [
	'$scope', '$q', '$http', '$modalInstance', 'burstMine-config', 'generatorPreset',
	function($scope, $q, $http, $modalInstance, p_config, p_generatorPreset) {
		$scope.error = null;
		$scope.generatorPreset = p_generatorPreset;
		$scope.benchmark = {
			speed:0,
			log:[]
		};

		$scope.clearError = function() {
			$scope.error = null;
		};

		var start = function() {
			var defer = $q.defer();
			$scope.clearError();

			$http.put(p_config.apiPath + '/benchmarks/generator', {
				generatorPreset:$scope.generatorPreset.id
			})
			.success(function(p_data) {
				$scope.benchmark = p_data;
				defer.resolve();
			})
			.error(function(p_data) {
				$scope.error = p_data;
				defer.reject(p_data);
			});

			return defer.promise;
		};

		$scope.stop = function() {
			var defer = $q.defer();
			$scope.clearError();

			$http.delete(p_config

			return defer.promise;
		};

		$scope.close = function() {
			$scope.stop()
			.then(function() {
				$modalInstance.dismiss();
			}, function(p_error) {
				$scope.error = p_error;
			});
		};

		$scope.start();
		$scope.$on('$destroy', $scope.stop);
	}
]);