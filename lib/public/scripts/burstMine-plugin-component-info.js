/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-plugin-component-info', [
	'$scope', '$modalInstance', 'burstMine-config', 'plugin', 'category', 'component',
	function($scope, $modalInstance, p_config, p_plugin, p_category, p_component) {
		$scope.plugin = p_plugin;
		$scope.category = p_category;
		$scope.component = p_component;
		$scope.template = p_config.publicPath + p_config.plugins.publicPath + '/' + p_plugin.type + '/templates/burstMine-plugin-' + p_plugin.type + '-' + p_category + '-' + p_component.type + '-info.html';

		$scope.close = function() {
			$modalInstance.close();
		};
	}
]);