'use strict';

/**
 * @ngdoc directive
 * @name webAdminApp.directive:prettyprint
 * @description
 * # prettyprint
 */
/* jshint ignore:start */
angular.module('webAdminApp')
  .directive('prettyprint', function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element) {
        element.html(prettyPrintOne(element.html(),'',true));
      }
    };
  });
/* jshint ignore:end */
