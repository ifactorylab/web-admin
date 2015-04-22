'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesChatCtrl
 * @description
 * # PagesChatCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('ChatCtrl', function ($scope, $resource) {
    $scope.inbox = $resource('scripts/jsons/chats.json').query();

    $scope.archive = function(index) {
      $scope.inbox.splice(index, 1);
    };
  });
