'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:NewProductCtrl
 * @description
 * # NewProductCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('NewProductCtrl', function ($scope, $modalInstance, $state, items, site, storage, FileUploader, toastr, toastrConfig, productApi) {
    $scope.items = items;
    $scope.selected = {
      // item: $scope.items[0]
    };

    $scope.product = {};
    $scope.category = {};
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
      msg: 'Succeeded to create new site',
      title: 'Create new site'
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

    $scope.authToken = storage.get("auth_token");

    productApi.getCategories($scope.authToken, site.id).then(function(data) {
      $scope.categories = data.categories;
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }
      // $scope.showAlert(message, 'danger', 'fa-warning');
    });

    $scope.stopPropagation = function(e) {
      e.stopPropagation();
    };

    $scope.createCategory = function(category) {
      $scope.category = category;
      productApi.createCategory($scope.authToken, site.id, {"name": category}).then(function(data) {
        $scope.categories.push(data.category);
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.createProduct = function() {
      var product = $scope.product;
      product.category_id = product.category.id;
      console.log("createProduct");
      console.log(product);
      productApi.createProduct($scope.authToken, site.id, product).then(function(data) {
        $modalInstance.dismiss('cancel');
        $state.go('app.page.products', {}, { reload: true });
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.removePreviewImage = function() {
      $scope.image = null;
    };

    var uploader = $scope.uploader = new FileUploader({
      method: 'POST',
      autoUpload: true,
      headers: { 'Venice-Authorization': $scope.authToken },
      alias: 'file'
    });

    // CALLBACKS
    uploader.onAfterAddingFile = function(fileItem) {
      console.info('onAfterAddingFile', fileItem);
      fileItem.url = 'http://service-image.herokuapp.com/products'
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
      var product = response.product;
      console.log(product);
      if ($scope.product.images == null) {
        $scope.product.images = [];
      }
      $scope.product.images.push({"image": product.file_name, "image_id": product.id});
      if ($scope.images == null) {
        $scope.images = [];
      }
      $scope.images.push({"image": product.file.small.url, "imageLarge": product.file.large.url});
    };
  });