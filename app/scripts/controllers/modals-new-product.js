'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:NewProductCtrl
 * @description
 * # NewProductCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('NewProductCtrl', function ($scope, $modalInstance, items, storage, FileUploader, toastr, toastrConfig) {
    $scope.items = items;
    $scope.selected = {
      // item: $scope.items[0]
    };

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
    $scope.createProduct = function(product) {
      console.log(site);

    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    var uploader = $scope.uploader = new FileUploader({
      method: 'PATCH',
      autoUpload: true,
      headers: { 'Venice-Authorization': $scope.authToken },
      alias: 'file'
    });
  });