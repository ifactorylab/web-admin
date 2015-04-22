'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('HelpCtrl', function ($scope) {
     $scope.page = {
      title: 'Documentation',
      subtitle: 'Place subtitle here...'
    };
  });
