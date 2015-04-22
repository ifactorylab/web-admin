'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ShopSingleProductCtrl
 * @description
 * # ShopSingleProductCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SingleProductCtrl', function ($scope) {
    $scope.page = {
      title: 'Single Product',
      subtitle: 'Place subtitle here...'
    };
  });
