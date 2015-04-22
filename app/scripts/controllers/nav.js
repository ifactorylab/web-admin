'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('NavCtrl', function ($scope) {
    $scope.oneAtATime = false;

    $scope.status = {
      isFirstOpen: true,
      isSecondOpen: true,
      isThirdOpen: true
    };
  });