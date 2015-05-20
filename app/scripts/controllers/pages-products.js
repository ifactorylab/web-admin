'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:ProductsCtrl
 * @description
 * # ProductsCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ProductsCtrl', function ($rootScope, $scope, $sce, $modal, storage, siteApi, contentApi) {
    $rootScope.$broadcast('showPageLeftBar', "w-80p");
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    $scope.hideLeftBar = function() {
      $rootScope.$broadcast('hidePageLeftBar');
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

    /*
    $scope.getSiteContent = function(authToken, siteId, contentApi) {
      contentApi.show(authToken, siteId).then(function(data) {
        $scope.site.content = data.site;
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.getPageContents = function(authToken, pageId, contentApi) {
      contentApi.getContents(authToken, pageId).then(function(data) {
        $scope.contents = data.contents;
        console.log($scope.contents);
        $rootScope.$broadcast('completePageContents');

      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.getSitePages = function(authToken, siteId, contentApi) {
      contentApi.getPages(authToken, siteId).then(function(data) {
        $scope.pages = data.pages;
        console.log($scope.pages);
        $rootScope.$broadcast('completeSitePages');

        if ($scope.pages.length > 0) {
          $scope.getPageContents(authToken, $scope.pages[0].id, contentApi);
        }

      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $rootScope.getCurrentSite = function() {
      if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.authToken = storage.get("auth_token");
    console.log($scope.getCurrentSite());
    if ($scope.getCurrentSite()) {
      $scope.site = $scope.getCurrentSite();
      $scope.getSitePages($scope.authToken, $scope.site.id, contentApi);
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
          $scope.getSitePages($scope.authToken, $scope.site.id, contentApi);
        }
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }


*/
  })
  .controller('ProductsTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, $resource) {

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

    $resource('http://www.filltext.com/?rows=300&id={index}&name={lorem|2}&category=["Food","Drinks","Accesories","Electro","Kitchen","Bathroom"]&price={numberLength|3}}&date={date|01-01-2012,01-01-2015}&status=["published","not published","deleted"]&pretty=true').query().$promise.then(function(products) {
      vm.products = products;
    });

  });
