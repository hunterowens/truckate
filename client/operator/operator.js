'use strict';

function OperatorController($scope, socket) {
	$scope.entryDesc = "";
	$scope.entryPrice = "";

	$scope.updateLocation = function() {};

	$scope.submit = function() {
		if (!$scope.entryName) {
			console.log("Your entry needs a name!");
		} else if (!$scope.entryPrice) {
			console.log("Your entry needs a price!");
		} else {
			console.log("it worked?");
			socket.emit('operator:newEntry', {name: $scope.entryName, price: $scope.entryPrice});
			console.log("it worked!");
		}
	};
}
OperatorController.$inject = ['$scope', 'socket'];

