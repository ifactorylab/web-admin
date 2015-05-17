'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PageCtrl
 * @description
 * # PageCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('PagesCtrl', function ($rootScope, $scope, $sce, storage, siteApi, contentApi) {

    $scope.getSiteContent = function(authToken, siteId, contentApi) {
      contentApi.show(authToken, siteId).then(function(data) {
        $scope.site.content = data.site;
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.getPageContents = function(authToken, pageId, contentApi) {
      contentApi.getContents(authToken, pageId).then(function(data) {
        $scope.contents = data.contents;
        console.log($scope.contents);
        $rootScope.$broadcast('completePageContents');

      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.getSitePages = function(authToken, siteId, contentApi) {
      contentApi.getPages(authToken, siteId).then(function(data) {
        $scope.pages = data.pages;
        console.log($scope.pages);
        $rootScope.$broadcast('completeSitePages');

        if ($scope.pages.length > 0) {
          $scope.getPageContents(authToken, $scope.pages[0].id, contentApi);
        }

      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $rootScope.getCurrentSite = function() {
      if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.authToken = storage.get("auth_token");
    console.log($scope.getCurrentSite());
    if ($scope.getCurrentSite()) {
      $scope.site = $scope.getCurrentSite();
      $scope.getSitePages($scope.authToken, $scope.site.id, contentApi);
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
          $scope.getSitePages($scope.authToken, $scope.site.id, contentApi);
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
