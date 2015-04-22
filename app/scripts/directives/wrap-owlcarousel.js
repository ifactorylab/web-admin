'use strict';

/**
 * @ngdoc directive
 * @name webAdminApp.directive:wrapOwlcarousel
 * @description
 * # wrapOwlcarousel
 */
angular.module('webAdminApp')
  .directive('wrapOwlcarousel', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element) {
        var options = scope.$eval(angular.element(element).attr('data-options'));

        angular.element(element).owlCarousel(options);
      }
    };
  });
