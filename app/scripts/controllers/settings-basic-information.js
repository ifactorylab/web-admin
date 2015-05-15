'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BasicInformationCtrl
 * @description
 * # BasicInformationCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BasicInformationCtrl', ['$scope', '$rootScope', 'contentApi', 'storage',
      function($scope, $rootScope, contentApi, storage) {
    $rootScope.$broadcast('showPageLeftBar');
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    $scope.hideLeftBar = function() {
      console.log("leftBar");
      $rootScope.$broadcast('hidePageLeftBar');
    };

  }]);