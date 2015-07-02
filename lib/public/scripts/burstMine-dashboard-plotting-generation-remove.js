/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generation-remove', [
	'$scope', '$http', '$modalInstance', 'burstMine-config', 'generation',
	function($scope, $http, $modalInstance, p_config, p_generation) {
		$scope.error = null;
		$scope.generation = p_generation;

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.yes = function() {
			$scope.clearError();

			$http.delete(p_config.apiPath + '/generations/' + $scope.generation.id)
			.success(function() {
				$modalInstance.close();
			})
			.error(function(p_data) {
				$scope.error = p_data;
			});
		};

		$scope.no = function() {
			$modalInstance.dismiss();
		};
	}
]);