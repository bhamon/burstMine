angular
.module('burstMine')
.controller('burstMine-mine-add', [
	'$scope', '$modalInstance',
	function($scope, $modalInstance) {
		$scope.data = {
			name:'',
			url:''
		};

		$scope.add = function() {
			$scope.$broadcast('show-errors-check-validity');
			if($scope.formAdd.$valid) {
				$modalInstance.close({
					name:$scope.data.name,
					url:$scope.data.url
				});
			}
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}
]);