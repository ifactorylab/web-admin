'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BackgroundCtrl
 * @description
 * # BackgroundCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BackgroundCtrl', ['$scope', '$rootScope', 'FileUploader', function($scope, $rootScope, FileUploader) {
    $rootScope.$broadcast('showPageLeftBar');

    $scope.hideLeftBar = function() {
      console.log("leftBar");
      $rootScope.$broadcast('hidePageLeftBar');
    };

    var uploader = $scope.uploader = new FileUploader({
      url: 'scripts/modules/fileupload/upload.php'
    });

    // FILTERS

    uploader.filters.push({
      name: 'customFilter',
      fn: function() {
        return this.queue.length < 10;
      }
    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
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
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
  }]);