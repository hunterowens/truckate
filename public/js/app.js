'use strict';

angular.module("demo.services", [])
  .factory("socket", function ($rootScope) {
    var socket = io.connect();
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
  })
  .factory("messageService", function ($rootScope, socket) {
    socket.on("newMessage", function(message) {
      $rootScope.$broadcast("demo.messageReceived", message);
    });
    var send = function(text, cb) {
      return socket.emit("sendMessage", text, cb);
    };
    return { send: send };
  });


angular.module("demo", ["demo.services"]);

function MessageCtrl($scope, messageService) {
  $scope.messages = [];
  $scope.draft = "";
  $scope.error = "";
  $scope.$on("messageReceived", function (ev, message) {
    messages.push(message);
  });
  $scope.publish = function () {
    $scope.success = false;
    messageService.send(draft, function (success) {
      if (success) {
        $scope.draft = "";
      } else {
        $scope.error = "Failed to send message.";
      }
    });
  }
}
MessageCtrl.$inject = ["$scope", "messageService"];

