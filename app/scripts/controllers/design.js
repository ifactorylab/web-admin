'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:DesignCtrl
 * @description
 * # DesignCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('DesignCtrl', function ($rootScope, $scope, $sce, $state, storage, siteApi, toastr) {

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
      msg: 'Succeeded to save style',
      title: 'Design'
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
      $scope.showLeft = false;
    };

    $rootScope.getCurrentSite = function() {
      if (storage.get("current_site")) {
        return storage.get("current_site");
      }
      return null;
    }

    $scope.getStyle = function(authToken, siteId, siteApi) {
      siteApi.getStyle(authToken, siteId).then(function(data) {
        $scope.style = data.style;
        $rootScope.$broadcast('completeSiteStyle');
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.saveStyle = function(style) {
      siteApi.updateStyle($scope.authToken, style).then(function(data) {
        $scope.openToast();
        $state.reload();
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }
        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.authToken = storage.get("auth_token");
    console.log("auth_token: " + $scope.authToken);
    console.log("settings: ");
    console.log($scope.getCurrentSite());
    if ($scope.getCurrentSite()) {
      $scope.site = $scope.getCurrentSite();
      $scope.getStyle($scope.authToken, $scope.site.id, siteApi);
    } else {
      siteApi.index($scope.authToken).then(function(data) {
        $scope.sites = data.sites;
        if (data.sites.length > 0) {
          $rootScope.currentSite = data.sites[0];
          $scope.site = data.sites[0];
          $scope.getStyle($scope.authToken, $scope.site.id, siteApi);
        }
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status == 401 || response.status == 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    }

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.showLeft = false;
    $scope.$on('showPageLeftBar', function () {
      $scope.showLeft = true;
    });

    $scope.$on('hidePageLeftBar', function () {
      $scope.showLeft = false;
    });
  });
