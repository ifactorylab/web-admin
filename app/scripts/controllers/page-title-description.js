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
      for (var i in $scope.pages) {
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

    contentApi.getPages($scope.authToken, $scope.site.id).then(function(data) {
      $scope.pages = data.pages;
      console.log($scope.pages);
      $scope.steps = {};
      for (var i in $scope.pages) {
        $scope.steps["step" + ++i] = (i == 1 ? true : false);
      }

      console.log($scope.steps);
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }

      // $scope.showAlert(message, 'danger', 'fa-warning');
    });

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