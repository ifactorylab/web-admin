'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('HeaderCtrl', function ($scope, $state, $modal, storage, authApi) {
    $scope.authToken = storage.get("auth_token");

    $scope.logout = function() {
      authApi.destroy($scope.authToken).then(function(data) {
        storage.set("auth_token", null);
        storage.set("refresh_token", null);
        $state.go('core.login');
      }, function(response) {
        storage.set("auth_token", null);
        storage.set("refresh_token", null);
        $state.go('core.login');
      });
    };

    $scope.createNewSite = function() {
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/tmpl/new-site-modal.html',
        controller: 'NewSiteModalCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          },
          /*
          site: function () {
            return site;
          },
          business: function () {
            return business;
          },
          hours: function () {
            return hours;
          }
          */
        }
      });

      $scope.modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }
  });

