'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:RightBarCtrl
 * @description
 * # PagesSitesCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('RightBarCtrl', function ($rootScope, $scope, $state, storage, siteApi) {
    $scope.authToken = storage.get("auth_token");
    siteApi.index($scope.authToken).then(function(data) {
      $scope.sites = data.sites;
      if (data.sites.length > 0) {
        $rootScope.currentSite = data.sites[0];
      }
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }

      // $scope.showAlert(message, 'danger', 'fa-warning');
    });

    $scope.goSite = function(site) {
      $rootScope.currentSite = site;
      storage.set("current_site", site);
      $scope.main.settings.rightbarShow = false;
      $state.go('app.page', {}, { reload: true });
    };
  });