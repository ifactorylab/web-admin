'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('NewSiteModalCtrl', function ($scope, $modalInstance, items, storage, siteApi) {
    $scope.items = items;
    $scope.selected = {
      // item: $scope.items[0]
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
      if (hours) {
        var hoursObjects = {};
        for (var day in hours) {
          var tokens = (hours[day] != "" ? hours[day].split(",") : []);
          if (hours[day]) {
            hoursObjects[day] = [];
            for (var key in tokens) {
              hoursObjects[day].push({ "text": tokens[key], "action": "create" });
            }
          }
        }

        siteApi.createHours($scope.authToken, $scope.business.id, hoursObjects).then(function(data) {
          $scope.steps.step4 = true;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }

      $scope.ok();
    }

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });