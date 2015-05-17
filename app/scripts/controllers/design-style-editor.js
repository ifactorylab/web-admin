'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:StyleEditorCtrl
 * @description
 * # StyleEditorCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('StyleEditorCtrl', function($scope, $rootScope, storage) {
    $rootScope.$broadcast('showPageLeftBar');
  });