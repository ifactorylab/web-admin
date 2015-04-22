'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesProfileCtrl
 * @description
 * # PagesProfileCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.page = {
      title: 'Profile Page',
      subtitle: 'Place subtitle here...'
    };
  });
