'use strict';

var socket = io.connect();
angular.module('demo.services', [])
	.factory('socket', function ($rootScope) {
		return {
			on: function (eventName, callback) {
				socket.on(eventName, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						callback.apply(socket, args);
					});
				});
			},
			emit: function (eventName, data, callback) {
				socket.emit(eventName, data, function () {
					var args = arguments;
					$rootScope.$apply(function () {
						if (callback) {
							callback.apply(socket, args);
						}
					});
				})
			}
		};
	});

angular.module('demo', ['demo.services']);

function opController($scope, socket) {
	$scope.entryDesc = "";

	$scope.updateLocation = function() {};

	$scope.submit = function() {
		if (!$scope.entryName) {
			alert("Your entry needs a name!");
		} else if (!$scope.entryPrice) {
			alert("Your entry needs a price!");
		} else {
			alert("it worked?");
			socket.emit('opSubmit', {});
			alert("it worked!");
		}
	};
}
opController.$inject = ['$scope', 'socket'];