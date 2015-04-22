'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesTimelineCtrl
 * @description
 * # PagesTimelineCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('TimelineCtrl', function ($scope) {
    $scope.page = {
      title: 'Timeline',
      subtitle: 'Place subtitle here...'
    };
  });
