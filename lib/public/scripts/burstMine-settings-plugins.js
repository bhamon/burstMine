/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-settings-plugins', [
	'$scope', '$modal', '$http', 'burstMine-config',
	function($scope, $modal, $http, p_config) {
		$scope.error = null;
		$scope.plugins = [];

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.load = function() {
			$scope.clearError();
			$scope.plugins = [];

			$http.get(p_config.apiPath + '/plugins')
			.success(function(p_data) {
				for(var i = 0 ; i < p_data.length ; ++i) {
					var plugin = p_data[i];
					plugin.status = 'fetching';
					$scope.plugins.push(plugin);
				}
			})
			.error(function(p_data) {
				$scope.error = p_data;
			});
		};

		$scope.load();
	}
]);