/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-plots', [
	'$scope', '$q', '$http', '$modal', 'burstMine-config',
	function($scope, $q, $http, $modal, p_config) {
		$scope.error = null;
		$scope.plots = [];

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.refresh = function() {
			var defer = $q.defer();

			$scope.clearError();
			$http.get(p_config.apiPath + '/plots')
			.success(function(p_data) {
				$scope.plots = p_data;
			})
			.error(function(p_data) {
				$scope.error = p_data;
				$scope.plots = [];
			});

			return defer.promise;
		};

		$scope.import = function() {
/*
			var modal = $modal.open({
				templateUrl:p_config.publicPath + '/templates/burstMine-dashboard-plotting-plots-import.html',
				controller:'burstMine-dashboard-plotting-plots-import'
			});

			modal.result.then(function() {
				$scope.refresh();
			});
*/
		};

		$scope.remove = function(p_plots) {
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
				$scope.refresh();
			});
		};

		$scope.refresh();
	}
]);