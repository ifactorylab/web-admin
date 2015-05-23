'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ProductCtrl
 * @description
 * # ProductCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ProductCtrl', function ($rootScope, $modalInstance, $state, $scope, product, site, storage, FileUploader, productApi) {
    $scope.site = site;
    $scope.authToken = storage.get("auth_token");
    $scope.product = product;

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.setImage = function(product) {
      if (product.image) {
        $scope.image = product.image.small_url;
        $scope.imageLarge = product.image.very_large_url;
      }
    };

    if (product) {
      $scope.setImage(product);
    }

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

    $scope.updateProduct = function(product) {
      // product.category_id = product.category.id;
      console.log(product);
      productApi.updateProduct($scope.authToken, product).then(function(data) {
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


    $scope.deleteProduct = function(product) {
      productApi.deleteProduct($scope.authToken, product.id).then(function(data) {
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
      $scope.product.image = product.file_name;
      $scope.product.image_id = product.id;
      $scope.image = product.file.small.url;
      $scope.imageLarge = product.file.large.url;
    };
  });
