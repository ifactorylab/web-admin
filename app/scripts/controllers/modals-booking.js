'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BookingCtrl
 * @description
 * # BookingCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BookingCtrl', function ($rootScope, $modalInstance, $state, $stateParams, $scope, booking, site, storage, bookingApi) {
    $scope.site = site;
    $scope.authToken = storage.get("auth_token");
    $scope.booking = booking;
    console.log("SHOW BOOKING =====");
    console.log(booking);
    $stateParams = {};

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.stopPropagation = function(e) {
      e.stopPropagation();
    };

    $scope.confirmBooking = function(booking) {
      bookingApi.confirmBooking($scope.authToken, booking).then(function(data) {
        $modalInstance.dismiss('cancel');
        $state.go('app.commerce.bookings', {}, { reload: true });
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.rejectBooking = function(booking) {
      bookingApi.rejectBooking($scope.authToken, booking).then(function(data) {
        $modalInstance.dismiss('cancel');
        $state.go('app.commerce.bookings', {}, { reload: true });
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.deleteBooking = function(booking) {
      bookingApi.deleteBooking($scope.authToken, booking).then(function(data) {
        $modalInstance.dismiss('cancel');
        $state.go('app.commerce.bookings', {}, { reload: true });
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.toLocalTime = function(time) {
      return (new Date(Date.parse(time))).toLocaleString();
    };

  });
