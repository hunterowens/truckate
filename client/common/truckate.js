'use strict';

var socket = io.connect();
angular.module('truckate.commonServices', [])
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
  })
  .factory('sha', function ($rootScope) {
    return {
      hash: function (text) {
        var hashObj = new jsSHA(text, "TEXT");
        return hashObj.getHash("SHA-512", "HEX");
      }
    }
  });

angular.module('truckate', ['truckate.commonServices', 'truckate.operator']);

