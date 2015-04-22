'use strict';

/**
 * @ngdoc directive
 * @name webAdminApp.directive:TileControlClose
 * @description
 * # TileControlClose
 */
angular.module('webAdminApp')
  .directive('tileControlClose', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');

        element.on('click', function() {
          tile.addClass('closed').fadeOut();
        });
      }
    };
  });
