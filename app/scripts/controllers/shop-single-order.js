'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ShopSingleOrderCtrl
 * @description
 * # ShopSingleOrderCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SingleOrderCtrl', function ($scope) {
    $scope.page = {
      title: 'Single Order',
      subtitle: 'Place subtitle here...'
    };
  });
