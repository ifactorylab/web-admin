'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('HeaderCtrl', function ($scope, $state, authApi, storage) {

    $scope.logout = function() {
      authApi.destroy(storage.get("auth_token")).then(function(data) {
        storage.set("auth_token", null);
        storage.set("refresh_token", null);
        $state.go('core.login');
      }, function(response) {
        storage.set("auth_token", null);
        storage.set("refresh_token", null);
        $state.go('core.login');
      });
    };

  });
