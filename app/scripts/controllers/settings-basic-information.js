'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BasicInformationCtrl
 * @description
 * # BasicInformationCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BasicInformationCtrl', function($scope, $rootScope, $state, siteApi, storage, toastr, toastrConfig) {
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
      msg: 'Succeeded to save new basic information',
      title: 'Basic Information'
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

    $scope.saveBusiness = function(business) {
      console.log("saveBusiness");
      console.log(business);
      $scope.business = business;
      $scope.steps.step3=true;
    };

    $scope.saveBusinessHours = function() {
      console.log("=====");
      console.log($scope.hours);
      console.log("=====");
      console.log($scope.hourObjects);
      console.log("=====");

      var hours = $scope.hours;
      var hourObjects = $scope.hourObjects;
      var hoursToDelete = [];
      var hoursToUpdate = [];
      var hoursToCreate = {};

      for (var day in hours) {
        var tokens = (hours[day] != "" ? hours[day].split(",") : []);
        if (hourObjects[day]) {
          var array = hourObjects[day];
          if (tokens.length < array.length) {
            for (var i = tokens.length; i < array.length; i++) {
              hoursToDelete.push(array[i]);
            }
          }

          for (var key in tokens) {
            if (array[key]) {
              if (array[key].text.trim() != tokens[key].trim()) {
                array[key].text = tokens[key];
                hoursToUpdate.push(array[key])
              }
            } else {
              if (hoursToCreate[day] == null) {
                hoursToCreate[day] = [];
              }
              hoursToCreate[day].push(tokens[key]);
            }
          }
        } else {
          if (hours[day]) {
            hoursToCreate[day] = [];
            for (var key in tokens) {
              hoursToCreate[day].push(tokens[key]);
            }
          }
        }
      }

      if (Object.keys(hoursToCreate).length > 0) {
        var n = 0;
        siteApi.createHours($scope.authToken, $scope.business.id, hoursToCreate).then(function(data) {
          if (++n == hours.length && hoursToDelete.length == 0 && hoursToUpdate.length == 0) {
            $scope.openToast();
            $state.go('app.settings.basic-information', {}, { reload: true });
          }
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }

      if (hoursToDelete.length > 0) {
        var n = 0;
        for (var i in hoursToDelete) {
          siteApi.deleteHour($scope.authToken, hoursToDelete[i].id).then(function(data) {
            if (++n == hoursToDelete.length && hoursToUpdate.length == 0) {
              $scope.openToast();
              $state.go('app.settings.basic-information', {}, { reload: true });
            }
          }, function(response) {
            var message = 'Something bad happened :(';
            if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
              message = response.data.error.message;
            }
            // $scope.showAlert(message, 'danger', 'fa-warning');
          });
        }
      }

      if (hoursToUpdate.length > 0) {
        var n = 0;
        for (var i in hoursToUpdate) {
          siteApi.updateHour($scope.authToken, hoursToUpdate[i]).then(function(data) {
            if (++n == hoursToUpdate.length) {
              $scope.openToast();
              $state.go('app.settings.basic-information', {}, { reload: true });
            }
          }, function(response) {
            var message = 'Something bad happened :(';
            if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
              message = response.data.error.message;
            }
            // $scope.showAlert(message, 'danger', 'fa-warning');
          });
        }
      }
    };

    $scope.saveBasicInfo = function() {
      console.log($scope.business);
      if ($scope.business.id == null) {
        siteApi.createBusiness($scope.authToken, $scope.site.id, $scope.business).then(function(data) {
          $scope.business.id = data.business.id;
          $scope.saveBusinessHours();
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      } else {
        $scope.saveBusinessHours();
      }
    };
  });

