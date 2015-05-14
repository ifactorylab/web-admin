'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:TitleDescCtrl
 * @description
 * # TitleDescCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('TitleDescCtrl', ['$scope', '$rootScope', 'FileUploader', 'contentApi', 'storage',
      function($scope, $rootScope, FileUploader, contentApi, storage) {
    $rootScope.$broadcast('showPageLeftBar');
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    $scope.hideLeftBar = function() {
      console.log("leftBar");
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.saveTitles = function(pages) {
      for (var i in pages) {
        contentApi.updatePage($scope.authToken, pages[i]).then(function(data) {

        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }
    }

    var uploader = $scope.uploader = new FileUploader({
      url: 'scripts/modules/fileupload/upload.php'
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
      url: 'scripts/modules/fileupload/upload.php'
    });

    // CALLBACKS

    uploader1.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    };
    uploader1.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      var file=fileItem._file;
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.image1 = evt.target.result;
          console.info('onAfterAddingFile', $scope.image1);
        });
      };
      reader.readAsDataURL(file);
    };
    uploader1.onAfterAddingAll = function(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    };
    uploader1.onBeforeUploadItem = function(item) {
      console.info('onBeforeUploadItem', item);
    };
    uploader1.onProgressItem = function(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    };
    uploader1.onProgressAll = function(progress) {
      console.info('onProgressAll', progress);
    };
    uploader1.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader1.onErrorItem = function(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader1.onCancelItem = function(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader1.onCompleteItem = function(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader1.onCompleteAll = function() {
      console.info('onCompleteAll');
    };

    console.info('uploader', uploader1);
  }]);