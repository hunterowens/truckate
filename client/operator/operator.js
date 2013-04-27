'use strict';

angular.module('truckate.operator', ['truckate.commonServices'])
  .factory('operatorDataService', ['$rootScope', 'socket', 'sha', function ($rootScope, socket, sha) {
    var svc = {};

    svc.user = null;

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
      svc.authenticated = true;
      svc.user = msg;
      $rootScope.$broadcast('operator:loggedIn', msg);
    });
    socket.on('operator:loginFailed', function (msg) {
      $rootScope.$broadcast('operator:loginFailed', msg);
    });

    svc.addEntry = function (msg) {
      socket.emit('operator:addEntry', msg);
    };

    svc.listMenus = function () {
      socket.emit('operator:listMenus', {truck_id: svc.user.truck_id});
    };
    socket.on('operator:menuList', function (msg) {
      $rootScope.$broadcast('operator:menuList', msg);
    });
    svc.selectMenu = function (menu) {
      $rootScope.$broadcast('operator:menuSelected', menu);
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
      $scope.$on('operator:loggedIn', function (ev, user) {
        $scope.authenticated = true;
      });
    }])
  .controller('MenuSelectionController', ['$scope', 'operatorDataService',
    function ($scope, data) {
      $scope.menus = [];
      $scope.menu = null;
      data.listMenus();
      $scope.$on('operator:menuList', function (ev, msg) {
        $scope.menus = msg.menus;
      });
      $scope.$watch('menu', function () {
        $scope.$emit('operator:menuSelected', $scope.menu);
      });
    }])
  .controller('MenuEditorController', ['$scope', 'operatorDataService',
    function ($scope, data) {
      $scope.entryName = "";
      $scope.entryPrice = "";
      $scope.entryAvailable = true;

      $scope.$on('operator:menuSelected', function (ev, menu) {
        $scope.menu = menu;
      });

      $scope.submit = function () {
        data.addEntry({
          menu_id: $scope.menu._id,
          entry: {
            name: $scope.entryName,
            price: $scope.entryPrice,
            available: $scope.entryAvailable
          }
        });
      };
  }]);

