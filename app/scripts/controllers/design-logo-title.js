'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:LogoTitleCtrl
 * @description
 * # LogoTitleCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('LogoTitleCtrl', function($scope, $rootScope, storage, FileUploader) {
    $rootScope.$broadcast('showPageLeftBar');

    var uploader = $scope.uploader = new FileUploader({
      method: 'PATCH',
      autoUpload: true,
      alias: 'file'
    });
  });