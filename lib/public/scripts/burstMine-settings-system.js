/*
	Burst mine
	Distributed graphical plotter and miner for Burst.
	Author: Cryo
	Bitcoin: 138gMBhCrNkbaiTCmUhP9HLU9xwn5QKZgD
	Burst: BURST-YA29-QCEW-QXC3-BKXDL
*/

angular
.module('burstMine')
.controller('burstMine-settings-system', [
	'$scope', '$q', '$http', 'burstMine-config',
	function($scope, $q, $http, p_config) {
		$scope.error = null;
		$scope.success = null;

		$scope.data = {
			pluginsRepository:'',
			smtpHost:'',
			smtpPort:0,
			senderEmail:''
		};

		$scope.clearError = function() {
			$scope.error = null;
		};

		$scope.clearSuccess = function() {
			$scope.success = null;
		};

		$scope.load = function() {
			var defer = $q.defer();
			$scope.clearError();

			$http.get(p_config.apiPath + '/settings')
			.success(function(p_data) {
				$scope.data.pluginsRepository = p_data.pluginsRepository;
				$scope.data.smtpHost = p_data.smtpHost;
				$scope.data.smtpPort = p_data.smtpPort;
				$scope.data.senderEmail = p_data.senderEmail;
				defer.resolve();
			})
			.error(function(p_data) {
				$scope.error = p_data;
				defer.reject(p_data);
			});

			return defer.promise;
		};

		$scope.save = function() {
			$scope.clearSuccess();
			$scope.clearError();

			$scope.$broadcast('show-errors-check-validity');
			if(!$scope.formSystem.$valid) {
				return;
			}

			var settings = {};
			if($scope.formSettings.pluginsRepository.$dirty) { settings.pluginsRepository = $scope.data.pluginsRepository; }
			if($scope.formSettings.smtpHost.$dirty) { settings.smtpHost = $scope.data.smtpHost; }
			if($scope.formSettings.smtpPort.$dirty) { settings.smtpPort = $scope.data.smtpPort; }
			if($scope.formSettings.senderEmail.$dirty) { settings.senderEmail = $scope.data.senderEmail; }
			if(Object.keys(settings).length == 0) {
				return;
			}

			$http.post(p_config.apiPath + '/settings', settings)
			.success(function() {
				$scope.success = true;
			})
			.error(function(p_data) {
				$scope.error = p_data;
			});
		};

		$scope.load();
	}
]);