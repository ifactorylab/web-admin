'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:FormsWizardCtrl
 * @description
 * # FormsWizardCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('FormWizardCtrl', function ($scope) {
    $scope.page = {
      title: 'Form Wizard',
      subtitle: 'Place subtitle here...'
    };
  });
