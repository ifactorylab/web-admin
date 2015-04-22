'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.partner
 * @description
 * # partner
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('partner', function (Restangular) {
    var partner = Restangular.setBaseUrl('http://service-partner.herokuapp.com').service('partners');
    partner.create = function (partner) {
      return this.post({partner: partner});
    };

    // Public API here
    return partner;
  });