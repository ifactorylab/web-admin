'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('HeaderCtrl', function ($scope, $state, storage, authApi) {
    $scope.authToken = storage.get("auth_token");

    $scope.logout = function() {
      authApi.destroy($scope.authToken).then(function(data) {
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
