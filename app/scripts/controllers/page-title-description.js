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

    $scope.removePreviewImage = function() {
      if ($scope.steps.step1) {
        $scope.image1 = null;
      } else if ($scope.steps.step2) {
        $scope.image2 = null;
      } else if ($scope.steps.step3) {
        $scope.image3 = null;
      }
    };

    $scope.setPageImages = function(pages) {
      $scope.image1 = pages[0].background.small.url;
      $scope.image2 = pages[1].background.small.url;
      $scope.image3 = pages[2].background.small.url;
      $scope.imageLarge1 = pages[0].background.large.url;
      $scope.imageLarge2 = pages[1].background.large.url;
      $scope.imageLarge3 = pages[2].background.large.url;
    };

    $scope.$on('completeSitePages', function () {
      $scope.setPageImages($scope.pages);
    });

    if ($scope.pages && $scope.pages.length > 0) {
      $scope.setPageImages($scope.pages);
    }

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
      method: 'PATCH',
      autoUpload: true,
      alias: 'file'
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      var pageId = $scope.pages[0].id;
      if ($scope.steps.step1) {
        pageId = $scope.pages[0].id;
      } else if ($scope.steps.step2) {
        pageId = $scope.pages[1].id;
      } else if ($scope.steps.step3) {
        pageId = $scope.pages[2].id;
      }
      fileItem.url = 'http://service-content.herokuapp.com/pages/' + pageId + '/background'
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
          if ($scope.steps.step1) {
            $scope.image1 = $scope.imageLarge1 = evt.target.result;
          } else if ($scope.steps.step2) {
            $scope.image2 = $scope.imageLarge2 = evt.target.result;
          } else if ($scope.steps.step3) {
            $scope.image3 = $scope.imageLarge3 = evt.target.result;
          }
        });
      };
      reader.readAsDataURL(file);
    };

  }]);