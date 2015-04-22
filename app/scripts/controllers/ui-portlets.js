'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:UiPortletsCtrl
 * @description
 * # UiPortletsCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('PortletsCtrl', function ($scope) {
    $scope.page = {
      title: 'Portlets',
      subtitle: 'Place subtitle here...'
    };
  });
