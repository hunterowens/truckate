'use strict';

var socket = io.connect("http://localhost:3000");
angular.module("demo.services", [])
  .factory("socket", function ($rootScope) {
    console.log(socket);
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
        console.log(eventName, data);
        socket.emit(eventName, data, function () {
          var args = arguments;
          console.log(args);
          console.log("hello?");
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });


angular.module("demo", ["demo.services"]);

function MessageCtrl($scope, socket) {
  $scope.messages = [];
  $scope.draft = "";
  $scope.error = "";
  socket.on("newMessage", function (message) {
    $scope.messages.push(message);
  });
  $scope.publish = function () {
    console.log("test");
    $scope.success = false;
    socket.emit("sendMessage", $scope.draft, function (success) {
      console.log(success);
      if (success) {
        $scope.draft = "";
      } else {
        $scope.error = "Failed to send message.";
      }
    });
  }
}
MessageCtrl.$inject = ["$scope", "socket"];

