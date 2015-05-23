'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ContentCtrl',
      function($scope, $rootScope, $state, FileUploader, contentApi, storage, toastr, toastrConfig) {
    $rootScope.$broadcast('showPageLeftBar', 'w-xl');
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    var openedToasts = [];

    $scope.toast = {
      colors: [
        {name:'primary'},
        {name:'success'},
        {name:'warning'},
        {name:'danger'},
        {name:'info'},
        {name:'default'},
        {name:'cyan'},
        {name:'amethyst'},
        {name:'green'},
        {name:'orange'},
        {name:'red'},
        {name:'greensea'},
        {name:'dutch'},
        {name:'hotpink'},
        {name:'drank'},
        {name:'blue'},
        {name:'lightred'},
        {name:'slategray'},
        {name:'darkgray'}
      ],
      icons: [
        {name: 'none', value: ''},
        {name: 'warning', value: 'fa-warning'},
        {name: 'check', value: 'fa-check'},
        {name: 'user', value: 'fa-user'}
      ],
      msg: 'Succeeded to save new contents',
      title: 'Contents'
    };

    $scope.options = {
      position: 'toast-top-right',
      type: 'success',
      iconClass: $scope.toast.colors[1],
      iconType: $scope.toast.icons[2],
      timeout: '3000',
      extendedTimeout: '1000',
      html: false,
      closeButton: false,
      tapToDismiss: true,
      closeHtml: '<i class="fa fa-times"></i>'
    };

    $scope.clearToasts = function() {
      toastr.clear();
    };

    $scope.openToast = function() {
      var toast = toastr[$scope.options.type]($scope.toast.msg, $scope.toast.title, {
                    iconClass: 'bg-'+$scope.options.iconClass.name,
                    iconType: $scope.options.iconType.value
                  });

      openedToasts.push(toast);
    };

    $scope.hideLeftBar = function() {
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.removePreviewImage = function() {
      if ($scope.steps.step1) {
        $scope.image1 = null;
      } else if ($scope.steps.step2) {
        $scope.image2 = null;
      } else if ($scope.steps.step3) {
        $scope.image3 = null;
      } else if ($scope.steps.step4) {
        $scope.image4 = null;
      }
    };

    $scope.setContentImages = function(contents) {
      $scope.image1 = contents[0].image.large.url;
      $scope.image2 = contents[1].image.large.url;
      $scope.image3 = contents[2].image.large.url;
      $scope.image4 = contents[3].image.large.url;
      $scope.imageLarge1 = contents[0].image.large.url;
      $scope.imageLarge2 = contents[1].image.large.url;
      $scope.imageLarge3 = contents[2].image.large.url;
      $scope.imageLarge4 = contents[3].image.large.url;
    };

    $scope.$on('completePageContents', function () {
      $scope.setContentImages($scope.contents);
    });

    if ($scope.contents && $scope.contents.length > 0) {
      $scope.setContentImages($scope.contents);
    }

    $scope.saveContents = function(contents) {
      var n = 0;
      for (var i in contents) {
        contentApi.updateContent($scope.authToken, contents[i]).then(function(data) {
          if (n++ == 2) {
            $scope.openToast();
            $state.go('app.page.content', {}, { reload: true });
          }
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
      headers: { 'Venice-Authorization': $scope.authToken },
      alias: 'file'
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      var contentId = $scope.contents[0].id;
      if ($scope.steps.step1) {
        contentId = $scope.contents[0].id;
      } else if ($scope.steps.step2) {
        contentId = $scope.contents[1].id;
      } else if ($scope.steps.step3) {
        contentId = $scope.contents[2].id;
      } else if ($scope.steps.step4) {
        contentId = $scope.contents[3].id;
      }
      fileItem.url = 'http://service-content.herokuapp.com/contents/' + contentId + '/image'
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
          } else if ($scope.steps.step4) {
            $scope.image4 = $scope.imageLarge4 = evt.target.result;
          }
        });
      };
      reader.readAsDataURL(file);
    };
  });