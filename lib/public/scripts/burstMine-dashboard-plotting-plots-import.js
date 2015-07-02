/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-dashboard-plotting-plots-import', [
	'$scope', '$q', '$http', '$modalInstance', 'burstMine-config',
	function($scope, $q, $http, $modalInstance, p_config) {
// TODO
		$scope.error = null;
		$scope.data = {
			path:'',
			address:0,
			offset:0,
			nonces:1,
			staggerSize:1
		};

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.onStaggerSizeChange = function() {
			if($scope.data.nonces % $scope.data.staggerSize) {
				$scope.data.nonces -= $scope.data.nonces % $scope.data.staggerSize;
				$scope.data.nonces += $scope.data.staggerSize;
			}
		};

		$scope.add = function() {
			$scope.$broadcast('show-errors-check-validity');
			if(!$scope.formAdd.$valid) {
				return;
			}

			var plotsFile = {
				path:$scope.data.path,
				address:$scope.data.address,
				offset:$scope.data.offset,
				nonces:$scope.data.nonces,
				staggerSize:$scope.data.staggerSize
			};

			$http.post(p_config.apiPath + '/plotsFiles', plotsFile)
			.success(function(p_data) {
				plotsFile.id = p_data.id;
				$modalInstance.close(plotsFile);
			})
			.error(function(p_data) {
				$scope.error = p_data;
			});
		};

		$scope.cancel = function(p_plotsFile) {
			$modalInstance.dismiss();
		};
	}
]);