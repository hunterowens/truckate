'use strict';

angular.module('truckate.operator', ['truckate.commonServices'])
  .factory('operatorDataService', ['$rootScope', 'socket', 'sha', function ($rootScope, socket, sha) {
    var svc = {};
    svc.authenticated = null;
    svc.user = null;
    svc.truck = null;
    svc.menus = null;

    svc.login = function (username, password) {
      if (!username || !password) {
        console.log("Please enter a username and password.");
        return;
      }
      var pwhash = sha.hash(password);
      socket.emit('operator:login', {
        username: username,
        password_hash: pwhash
      });
    };

    socket.on('operator:loggedIn', function (msg) {
      // Let the rest of the app know we're logged in
      console.log('operator:loggedIn', msg);
      svc.authenticated = true;
      svc.user = msg;
    });
    socket.on('operator:loginFailed', function (msg) {
      console.log('operator:loginFailed', msg);
      $rootScope.$broadcast('operator:loginFailed', msg);
    });
    svc.addEntry = function (entry) {
      socket.emit('operator:addEntry', entry);
    };

    return svc;
  }])
  .controller('LoginController', ['$scope', 'operatorDataService',
    function ($scope, data) {
      $scope.username = "";
      $scope.password = "";

      $scope.submit = function () {
        data.login($scope.username, $scope.password);
      }
    }])
  .controller('OperatorController', ['$scope', 'operatorDataService',
    function ($scope, data) {
      $scope.authenticated = false;
      $scope.$on('operator:loggedIn', function () {
        $scope.authenticated = true;
      });
    }])
  .controller('MenuEditorController', ['$scope', 'socket', 'operatorDataService',
    function ($scope, socket, data) {
      $scope.entryName = "";
      $scope.entryPrice = "";
      $scope.entryAvailable = true;

      $scope.on('operator:menuSelected', function (menu) {
        $scope.menu = menu;
      });

      $scope.submit = function () {
        data.addEntry({name: $scope.entryName, price: $scope.entryPrice, available: $scope.entryAvailable});
      };
  }]);

