'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:BookingsCtrl
 * @description
 * # BookingsCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('BookingsCtrl', function ($rootScope, $scope, $sce, $modal, storage) {
    $rootScope.$broadcast('showPageLeftBar', "w-80p");
    $scope.site = $rootScope.getCurrentSite();
    $scope.authToken = storage.get("auth_token");

    $scope.hideLeftBar = function() {
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.showBooking = function(booking) {
      $scope.modalInstance = $modal.open({
        templateUrl: 'views/tmpl/modals/booking.html',
        controller: 'BookingCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          },
          site: function () {
            return $scope.site;
          },
          booking: function () {
            return booking;
          },
          plugins: ['$ocLazyLoad', function($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/datatables/datatables.bootstrap.min.css',
              'scripts/vendor/datatables/Pagination/input.js',
              'scripts/vendor/datatables/ColumnFilter/jquery.dataTables.columnFilter.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.js',
              'scripts/vendor/touchspin/jquery.bootstrap-touchspin.css',
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
  .controller('BookingsTableCtrl', function ($scope, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, bookingApi) {

    var vm = this;
    vm.bookings = [];
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

      angular.forEach(vm.bookings, function(booking) {
        booking.selected = $scope.selectedAll;
      });
    };

    $scope.toLocalTime = function(time) {
      return (new Date(Date.parse(time))).toLocaleString();
    };

    bookingApi.getBookings($scope.authToken, $scope.site.id).then(function(data) {
      vm.bookings = data.bookings;
      console.log(data.bookings);
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }
      // $scope.showAlert(message, 'danger', 'fa-warning');
    });
  });
