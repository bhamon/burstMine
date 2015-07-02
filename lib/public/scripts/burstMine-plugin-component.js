/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.directive('burstMinePluginComponent', [
	'$sce',
	function($sce) {
		return {
			restrict:'E',
			controller:'burstMine-plugin-component',
			template:'<ng-include src="getTemplateUrl()"></ng-include>',
			scope:{
				controller:'=',
				template:'=',
				component:'='
			}
		};
	}
])
.controller('burstMine-plugin-component', [
	'$scope', '$controller',
	function($scope, $controller) {
		$scope.getTemplateUrl = function() {
			return $scope.template;
		};

		$controller($scope.controller, {$scope:$scope, component:$scope.component});
	}
]);