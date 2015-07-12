'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:TitleDescCtrl
 * @description
 * # TitleDescCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('TitleDescCtrl',
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
      msg: 'Succeeded to save new title / description',
      title: 'Title / Description'
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

    $scope.setPageImages = function(pages) {
      if (pages[0].background) {
        $scope.image1 = pages[0].background.small.url;
        $scope.imageLarge1 = pages[0].background.large.url;
      }
      if (pages[1].background) {
        $scope.image2 = pages[1].background.small.url;
        $scope.imageLarge2 = pages[1].background.large.url;
      }
      if (pages[2].background) {
        $scope.image3 = pages[2].background.small.url;
        $scope.imageLarge3 = pages[2].background.large.url;
      }
      if (pages[3].background) {
        $scope.image4 = pages[3].background.small.url;
        $scope.imageLarge4 = pages[3].background.large.url;
      }
    };

    $scope.$on('completeSitePages', function () {
      $scope.setPageImages($scope.pages);
    });

    if ($scope.pages && $scope.pages.length > 0) {
      $scope.setPageImages($scope.pages);
    }

    $scope.saveTitles = function(pages) {
      var n = 0;
      for (var i in pages) {
        contentApi.updatePage($scope.authToken, pages[i]).then(function(data) {
          if (n++ == 3) {
            $scope.openToast();
            $state.go('app.page.title-desc', {}, { reload: true });
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
      headers: { 'Venice-Authorization': $scope.authToken },
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
      } else if ($scope.steps.step4) {
        pageId = $scope.pages[3].id;
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
          } else if ($scope.steps.step4) {
            $scope.image4 = $scope.imageLarge4 = evt.target.result;
          }
        });
      };
      reader.readAsDataURL(file);
    };

  });