'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.siteApi
 * @description
 * # SiteApi
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('siteApi', function (Restangular) {
    var apiURL = 'http://service-site.herokuapp.com';
    // var apiURL = 'http://localhost:3000';

    var siteApi = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(apiURL);
    });

    siteApi.sitesWithAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({ 'Venice-Authorization': authToken });
      }).service("sites");
    };

    siteApi.businessesWithAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setDefaultHeaders({ 'Venice-Authorization': authToken });
      }).service("businesses");
    };

    siteApi.create = function (authToken, site) {
      return this.sitesWithAuthToken(authToken).post({site: site});
    };

    siteApi.index = function (authToken) {
      return this.sitesWithAuthToken(authToken).one().get();
    };

    siteApi.show = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId).get();
    };

    siteApi.createBusiness = function (authToken, siteId, business) {
      return this.sitesWithAuthToken(authToken).one(siteId).all("businesses")
        .post({business: business});
    };

    siteApi.business = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId).one("businesses").get();
    };

    siteApi.createHours = function (authToken, businessId, hours) {
      return this.businessesWithAuthToken(authToken).one(businessId).all("hours")
        .post({hours: hours});
    };

    siteApi.hours = function (authToken, businessId) {
      return this.businessesWithAuthToken(authToken).one(businessId).one("hours").get();
    };

    // Public API here
    return siteApi;
  });