'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:DesignCtrl
 * @description
 * # DesignCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('DesignCtrl', function ($rootScope, $scope, $sce, storage, siteApi, contentApi) {

    $rootScope.getCurrentSite = function() {
      if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.getStyle = function(authToken, siteId, siteApi) {
      siteApi.getStyle(authToken, siteId).then(function(data) {
        $scope.style = data.style;
        $rootScope.$broadcast('completeSiteStyle');

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
      $scope.getStyle($scope.authToken, $scope.site.id, siteApi);
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
          $scope.getStyle($scope.authToken, $scope.site.id, siteApi);
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
