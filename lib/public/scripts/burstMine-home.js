/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-home', [
	'$scope', '$state',
	function($scope, $state) {
		$scope.dashboard = function() {
			$state.go('dashboard.overview');
		};
	}
]);