'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:StyleEditorCtrl
 * @description
 * # StyleEditorCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('StyleEditorCtrl', function($scope, $rootScope, storage) {
    $rootScope.$broadcast('showPageLeftBar');

    $scope.hideLeftBar = function() {
      $rootScope.$broadcast('hidePageLeftBar');
    };

    $scope.setHeaderColor = function(color) {
      $scope.style.header_background_color = color;
    };

    $scope.setHeaderTitleColor = function(color) {
      $scope.style.header_title_color = color;
    };

    $scope.setFooterColor = function(color) {
      $scope.style.footer_background_color = color;
    };

    $scope.setFooterTitleColor = function(color) {
      $scope.style.footer_title_color = color;
    };
  });