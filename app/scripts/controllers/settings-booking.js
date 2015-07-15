'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BookingSettingCtrl
 * @description
 * # BookingSettingCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BookingSettingCtrl', function($scope, $rootScope, $state, contentApi, storage, toastr, toastrConfig) {
    $rootScope.$broadcast('showPageLeftBar');
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    var openedToasts = [];

    $scope.toast = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'danger'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'}
      ],
      icons: [
        {name: 'none', value: ''},
        {name: 'warning', value: 'fa-warning'},
        {name: 'check', value: 'fa-check'},
        {name: 'user', value: 'fa-user'}
      ],
      msg: 'Succeeded to save new booking page',
      title: 'Booking Page'
    };

    $scope.options = {
      position: 'toast-top-right',
      type: 'success',
      iconClass: $scope.toast.colors[1],
      iconType: $scope.toast.icons[2],
      timeout: '3000',
      extendedTimeout: '1000',
      html: false,
      closeButton: false,
      tapToDismiss: true,
      closeHtml: '<i class="fa fa-times"></i>'
    };

    $scope.clearToasts = function() {
      toastr.clear();
    };

    $scope.openToast = function() {
      var toast = toastr[$scope.options.type]($scope.toast.msg, $scope.toast.title, {
                    iconClass: 'bg-'+$scope.options.iconClass.name,
                    iconType: $scope.options.iconType.value
                  });

      openedToasts.push(toast);
    };

    $scope.hideLeftBar = function() {
      console.log("leftBar");
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.saveBookingContent = function() {
      console.log($scope.booking);
      contentApi.updateContent($scope.authToken, $scope.booking).then(function(data) {
          $scope.openToast();
          $state.go('app.settings.booking', {}, { reload: true });
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
    };
  });

