'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:MailInboxCtrl
 * @description
 * # MailInboxCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('MailInboxCtrl', function ($scope, $resource) {
    $scope.mails = $resource('scripts/jsons/mails.json').query();

    $scope.selectedAll = false;

    $scope.selectAll = function () {

      if ($scope.selectedAll) {
        $scope.selectedAll = false;
      } else {
        $scope.selectedAll = true;
      }

      angular.forEach($scope.mails, function(mail) {
        mail.selected = $scope.selectedAll;
      });
    };
  });
