/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-generatorPreset-remove', [
	'$scope', '$http', '$modalInstance', 'burstMine-config', 'generatorPreset',
	function($scope, $http, $modalInstance, p_config, p_generatorPreset) {
		$scope.error = null;
		$scope.generatorPreset = p_generatorPreset;

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.yes = function() {
			$scope.clearError();

			$http.delete(p_config.apiPath + '/generatorPresets/' + $scope.generatorPreset.id)
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