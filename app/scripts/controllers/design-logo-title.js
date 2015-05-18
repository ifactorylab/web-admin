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

    $scope.removePreviewImage = function() {
      $scope.image = null;
    };

    $scope.setStyleLogo = function(style) {
      if (style.logo) {
        $scope.image = style.logo.small_url;
        $scope.imageLarge = style.logo.small_url;
      }
    };

    $scope.$on('completeSiteStyle', function () {
      console.log($scope.style);
      $scope.setStyleLogo($scope.style);
    });

    if ($scope.style) {
      $scope.setStyleLogo($scope.style);
    }

    var uploader = $scope.uploader = new FileUploader({
      method: 'PATCH',
      headers: { 'Venice-Authorization': $scope.authToken },
      autoUpload: true,
      alias: 'file'
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      fileItem.url = 'http://service-site.herokuapp.com/style/' + $scope.style.id + '/logo'
      fileItem.upload();
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
      var file = fileItem._file;
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope) {
          $scope.image = $scope.imageLarge = evt.target.result;
        });
      };
      reader.readAsDataURL(file);
    };
  });