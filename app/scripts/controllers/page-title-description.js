'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:TitleDescCtrl
 * @description
 * # TitleDescCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('TitleDescCtrl', function ($scope, $rootScope) {
    $rootScope.$broadcast('showPageLeftBar');

    $scope.hideLeftBar = function() {
      console.log("leftBar");
      $rootScope.$broadcast('hidePageLeftBar');
    };
  });
