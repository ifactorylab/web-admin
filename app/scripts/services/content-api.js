'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.contentApi
 * @description
 * # ContentApi
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('contentApi', function (Restangular) {
    var apiURL = 'http://service-content.herokuapp.com';
    // var apiURL = 'http://localhost:3000';

    var contentApi = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(apiURL);
    });

    contentApi.sitesWithAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({ 'Venice-Authorization': authToken });
      }).service("sites");
    };

    contentApi.show = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId).get();
    };

    // Public API here
    return contentApi;
  });