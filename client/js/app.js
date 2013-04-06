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

function ChatCtrl($scope, socket) {
  $scope.messages = [];
  $scope.draft = '';
  $scope.error = '';
  $scope.room = 'lobby';
  $scope.nick = 'user';
  socket.on('newMessage', function (message) {
    $scope.messages.push(message);
  });
  socket.on('joinedRoom', function (room) {
    console.log("joined room", room);
    if ($scope.room != room) {
      $scope.room = room;
    }
  });
  $scope.joinRoom = function () {
    socket.emit('joinRoom', $scope.room);
  }
  $scope.changeNick = function () {
    socket.emit('changeNick', $scope.nick);
  }
  $scope.publish = function () {
    socket.emit('sendMessage', $scope.draft, function (success) {
      if (success) {
        $scope.draft = "";
      } else {
        $scope.error = 'Failed to send message.';
      }
    });
  }
}
ChatCtrl.$inject = ['$scope', 'socket'];

