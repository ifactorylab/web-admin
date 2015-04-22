'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesSearchResultsCtrl
 * @description
 * # PagesSearchResultsCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SearchResultsCtrl', function ($scope) {
    $scope.page = {
      title: 'Search Results',
      subtitle: 'Place subtitle here...'
    };
  });
