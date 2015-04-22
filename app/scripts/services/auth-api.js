'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.auth-api
 * @description
 * # AuthApi
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('authApi', function (Restangular) {
    var apiURL = 'http://service-auth.herokuapp.com';
    var authApi = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(apiURL);
    });

    authApi.withAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({ 'Venice-Authorization': authToken });
      }).service("auth");
    };

    authApi.create = function (partner) {
      return this.service("auth").one().post("partners", { partner: partner });
    };

    authApi.destroy = function (authToken) {
      Restangular.setDefaultHeaders({ "Venice-Authorization": authToken });
      return this.withAuthToken(authToken).one("partners").remove();
    };

    // Public API here
    return authApi;
  });