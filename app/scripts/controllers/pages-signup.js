'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesSignupCtrl
 * @description
 * # PagesSignupCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SignupCtrl', function ($scope, $state, $anchorScroll, $timeout, $location, partner) {

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

    $scope.signup = function() {
      partner.create($scope.partner).then(function(data) {
        $state.go('core.login');
      }, function(response) {
        var message = 'Something bad happened :(';
        if (response.status == 422 && response.data && response.data.error) {
          message = response.data.error.message;
        }

        $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

  });
