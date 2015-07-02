/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-plots-remove', [
	'$scope', '$modalInstance', 'burstMine-config', 'plots',
	function($scope, $modalInstance, p_config, p_plots) {
		$scope.plots = p_plots;

		$scope.yes = function() {
			$modalInstance.close();
		};

		$scope.no = function() {
			$modalInstance.dismiss();
		};
	}
]);