/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-plugin-info', [
	'$scope', '$modalInstance', 'burstMine-config', 'plugin',
	function($scope, $modalInstance, p_config, p_plugin) {
		$scope.plugin = p_plugin;
		$scope.template = p_config.publicPath + p_config.plugins.publicPath + '/' + p_plugin.type + '/templates/burstMine-plugin-' + p_plugin.type + '-info.html';

		$scope.close = function() {
			$modalInstance.close();
		};
	}
]);