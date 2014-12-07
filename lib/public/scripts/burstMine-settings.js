angular
.module('burstMine')
.controller('burstMine-settings', [
	'$scope', '$modal', '$http',
	function($scope, $modal, $http) {
		$scope.data = {
			status:'none'
		};

		$scope.clearStatus = function() {
			$scope.data.status = 'none';
		};

		$scope.load = function() {
			$scope.clearStatus();
		};

		$scope.load();
	}
]);