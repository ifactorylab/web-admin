'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('LoginCtrl', function ($scope, $state, $anchorScroll, $timeout, $location, authApi, storage) {
    $scope.showAlert = function(msg, type, icon) {
      var alert = {
        msg: msg,
        type: type,
        icon: icon,
        timeout: 9999*9999,
        closeable: true,
        closeall: true,
        focus: true
      };

      if (alert.closeall) {
        $scope.alerts = [];
      }

      $scope.alerts.push(alert);

      if (alert.focus) {
        $location.hash('alertsPlaceholder');

        // call $anchorScroll()
        $anchorScroll();
      }

      $timeout(function() {
        $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
      }, $scope.alerts[$scope.alerts.indexOf(alert)].timeout);
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.login = function() {
      authApi.create($scope.partner).then(function(data) {
        storage.set('auth_token', data.auth_token);
        storage.set('refresh_token', data.refresh_token);
        $state.go('app.dashboard');
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };
  });
