'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:MailComposeCtrl
 * @description
 * # MailComposeCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('MailComposeCtrl', function ($scope) {
    $scope.availableRecipients = ['RLake@nec.gov','RBastian@lacus.io','VMonroe@orci.ly','YMckenzie@mattis.gov','VMcmyne@molestie.org','BKliban@aliquam.gov','HHellems@tincidunt.org','KAngell@sollicitudin.ly'];
  });
