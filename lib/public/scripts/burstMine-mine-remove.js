angular
.module('burstMine')
.controller('burstMine-mine-remove', [
	'$scope', '$modalInstance',
	function($scope, $modalInstance) {
		$scope.yes = function() {
			$modalInstance.close();
		};

		$scope.no = function() {
			$modalInstance.dismiss();
		};
	}
]);