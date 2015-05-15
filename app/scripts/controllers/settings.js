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
      if ($rootScope.currentSite) {
        return $rootScope.currentSite;
      } else if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.authToken = storage.get("auth_token");
    if ($scope.getCurrentSite()) {
      $scope.site = $scope.getCurrentSite();
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
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
