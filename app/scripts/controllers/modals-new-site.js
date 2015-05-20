'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:NewSiteCtrl
 * @description
 * # NewSiteCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('NewSiteCtrl', function ($scope, $modalInstance, items, storage, siteApi, toastr, toastrConfig) {
    $scope.items = items;
    $scope.selected = {
      // item: $scope.items[0]
    };

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
      msg: 'Succeeded to create new site',
      title: 'Create new site'
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

    $scope.authToken = storage.get("auth_token");
    $scope.createSite = function(site) {
      console.log(site);
      if (site.id) {
        $scope.steps.step2 = true;
      } else {
        siteApi.create($scope.authToken, site).then(function(data) {
          $scope.steps.step2=true;
          $scope.site = site;
          $scope.site.id = data.site.id;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }

          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }
    };

    $scope.createBusiness = function(business) {
      if (business.id) {
        $scope.steps.step3 = true;
      } else {
        siteApi.createBusiness($scope.authToken, $scope.site.id, business).then(function(data) {
          $scope.steps.step3=true;
          $scope.business = business;
          $scope.business.id = data.business.id;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }

          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }
    }

    $scope.createHours = function(hours) {
      if (hours == null) {
        hours = {}
      }

      var hoursObjects = {};
      for (var day in hours) {
        var tokens = (hours[day] != "" ? hours[day].split(",") : []);
        if (hours[day]) {
          hoursObjects[day] = [];
          for (var key in tokens) {
            hoursObjects[day].push(tokens[key]);
          }
        }
      }

      siteApi.createHours($scope.authToken, $scope.business.id, hoursObjects).then(function(data) {
        $scope.openToast();
        $scope.ok();
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
          }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });