'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SettingsCtrl', function ($rootScope, $scope, $sce, storage, siteApi, contentApi) {

    $rootScope.getCurrentSite = function() {
      if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.merge_hours_text = function(hours) {
      var text = [];
      for (var key in hours) {
        text.push(hours[key].text);
      }
      return text.join(", ");
    }

    $scope.getBusinessHour = function(authToken, businessId, siteApi) {
      siteApi.hours(authToken, businessId).then(function(data) {
        $scope.hourObjects = data.hours;
        if ($scope.hourObjects) {
          $scope.hours = {};
          var week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
          for (var key in week) {
            $scope.hours[week[key]] = $scope.merge_hours_text($scope.hourObjects[week[key]]);
          }
        }

      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.getSiteBusiness = function(authToken, siteId, siteApi) {
      siteApi.business(authToken, siteId).then(function(data) {
        $scope.business = data.business;
        if ($scope.business != null) {
          $scope.getBusinessHour(authToken, $scope.business.id, siteApi);
        }
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.authToken = storage.get("auth_token");
    console.log("auth_token: " + $scope.authToken);
    console.log("settings: ");
    console.log($scope.getCurrentSite());
    if ($scope.getCurrentSite()) {
      $scope.site = $scope.getCurrentSite();
      $scope.getSiteBusiness($scope.authToken, $scope.site.id, siteApi);
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
          $scope.getSiteBusiness($scope.authToken, $scope.site.id, siteApi);
        }
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.showLeft = false;
    $scope.$on('showPageLeftBar', function () {
      $scope.showLeft = true;
    });

    $scope.$on('hidePageLeftBar', function () {
      $scope.showLeft = false;
    });
  });
