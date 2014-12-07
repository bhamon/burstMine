angular
.module('burstMine')
.controller('burstMine-mines', [
	'$scope', '$modal', '$http', '$state',
	function($scope, $modal, $http, $state) {
		$scope.data = {
			status:'none',
			mines:[]
		};

		$scope.clearStatus = function() {
			$scope.data.status = 'none';
		};

		$scope.load = function() {
			$scope.clearStatus();
			$http.get('/api/mines')
			.success(function(p_data) {
				$scope.data.status = 'load.success';
				$scope.data.mines = p_data;
			})
			.error(function(p_error) {
				$scope.data.status = 'load.failure';
			});
		};

		$scope.add = function(p_index) {
			var modal = $modal.open({
				templateUrl:'templates/burstMine-mine-add.html',
				controller:'burstMine-mine-add'
			});

			modal.result.then(function(p_mine) {
				$http.post('/api/mines', {
					name:p_mine.name,
					url:p_mine.url
				})
				.success(function(p_data) {
					p_mine.id = p_data.id;
					$scope.data.mines.push(p_mine);
					$scope.data.status = 'add.success';
				})
				.error(function(p_error) {
					$scope.data.status = 'add.failure';
				});
			});
		};

		$scope.view = function(p_mine) {
			$state.go('mine.overview', {
				mine:p_mine.id
			});
		};

		$scope.remove = function(p_mine) {
			var modal = $modal.open({
				templateUrl:'templates/burstMine-mine-remove.html',
				controller:'burstMine-mine-remove',
				size:'sm'
			});

			modal.result.then(function() {
				$http.delete('/api/mines/' + p_mine.id)
				.success(function() {
					$scope.data.mines.splice($scope.data.mines.indeOf(p_mine), 1);
					$scope.data.status = 'remove.success';
				})
				.error(function(p_error) {
					$scope.data.status = 'remove.failure';
				});
			});
		};

		$scope.load();
	}
]);