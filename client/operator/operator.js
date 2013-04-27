'use strict';

angular.module('truckate.operator', ['truckate.commonServices'])
  .controller('LoginController', ['$scope', 'socket', 'sha',
    function ($scope, socket, sha) {
      $scope.authenticated = false;
      $scope.username = "";
      $scope.password = "";

      socket.on('operator:loggedIn', function (msg) {
        $scope.authenticated = true;
        // Let the rest of the app know we're logged in
        $scope.emit('operator:loggedIn', msg);
      });
      socket.on('operator:loginFailed', function (msg) {
        console.log('operator:loginFailed', msg);
      });

      $scope.submit = function () {
        console.log($scope);
        if (!$scope.username || !$scope.password) {
          console.log("Please enter a username and password.");
          return;
        }
        var pwhash = sha.hash($scope.password);
        console.log(pwhash);
        socket.emit('operator:login', {
          username: $scope.username,
          password_hash: pwhash
        });
      }
    }])
  .controller('MenuEditorController', ['$scope', 'socket',
    function ($scope, socket, sha) {
      $scope.entryDesc = "";
      $scope.entryPrice = "";

      $scope.updateLocation = function() {};

      $scope.submit = function () {
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
  }]);

