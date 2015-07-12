'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ProductsCtrl', function ($rootScope, $scope, $sce, $modal, storage) {
    $rootScope.$broadcast('showPageLeftBar', "w-80p");
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    $scope.hideLeftBar = function() {
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.showProduct = function(product) {
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/tmpl/modals/product.html',
        controller: 'ProductCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          },
          site: function () {
            return $scope.site;
          },
          product: function () {
            return product;
          },
          plugins: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/filestyle/bootstrap-filestyle.min.js',
              'scripts/vendor/datatables/datatables.bootstrap.min.css',
              'scripts/vendor/datatables/Pagination/input.js',
              'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
              'scripts/vendor/magnific/magnific-popup.css',
              'scripts/vendor/magnific/jquery.magnific-popup.min.js'
            ]);
          }]
        }
      });

      $scope.modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };

    $scope.createNewProduct = function() {
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/tmpl/modals/new-product.html',
        controller: 'NewProductCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          },
          site: function () {
            return $scope.site;
          },
          plugins: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/filestyle/bootstrap-filestyle.min.js',
              'scripts/vendor/datatables/datatables.bootstrap.min.css',
              'scripts/vendor/datatables/Pagination/input.js',
              'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
              'scripts/vendor/magnific/magnific-popup.css',
              'scripts/vendor/magnific/jquery.magnific-popup.min.js'
            ]);
          }]
        }
      });

      $scope.modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    };
  })
  .controller('ProductsTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, productApi) {

    var vm = this;
    vm.products = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
      .withBootstrap()
      .withOption('order', [[0, 'asc']])
      .withDOM('<"row"<"col-md-8 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"pull-right"f>>>t<"row"<"col-md-4 col-sm-12"<"inline-controls"l>><"col-md-4 col-sm-12"<"inline-controls text-center"i>><"col-md-4 col-sm-12"p>>')
      .withLanguage({
        "sLengthMenu": 'View _MENU_ records',
        "sInfo":  'Found _TOTAL_ records',
        "oPaginate": {
          "sPage":    "Page",
          "sPageOf":  "of"
        }
      })
      .withPaginationType('input')
      //.withScroller()
      //.withOption("sScrollY", false)
      //.withOption("sScrollX")
      .withColumnFilter();


    vm.dtColumnDefs = [
      // DTColumnDefBuilder.newColumnDef(0).notSortable(),
      DTColumnDefBuilder.newColumnDef(3).notSortable()
    ];

    vm.selectedAll = false;

    vm.selectAll = function () {
      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach(vm.products, function(product) {
        product.selected = $scope.selectedAll;
      });
    };

    productApi.getProducts($scope.authToken, $scope.site.id).then(function(data) {
      vm.products = data.products;
      console.log(data.products);
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }
      // $scope.showAlert(message, 'danger', 'fa-warning');
    });
  });
