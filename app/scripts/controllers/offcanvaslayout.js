'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:OffcanvaslayoutCtrl
 * @description
 * # OffcanvaslayoutCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('OffcanvaslayoutCtrl', function ($scope) {
    $scope.page = {
      title: 'Off-canvas sidebar',
      subtitle: 'On small devices'
    };
  });
