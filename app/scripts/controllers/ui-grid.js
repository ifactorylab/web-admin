'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:UiGridCtrl
 * @description
 * # UiGridCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('GridCtrl', function ($scope) {
    $scope.page = {
      title: 'Grid',
      subtitle: 'Place subtitle here...'
    };
  });
