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

    contentApi.withAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer
          .setDefaultHeaders({ 'Venice-Authorization': authToken })
      });
    };

    contentApi.sitesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service("sites");
    };

    contentApi.pagesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service("pages");
    };

    contentApi.contentsWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service("contents");
    };

    contentApi.show = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId).get();
    };

    contentApi.getPages = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId).one("pages").get();
    };

    contentApi.updatePage = function (authToken, page) {
      return this.pagesWithAuthToken(authToken).one(page.id)
        .patch({ page: page });
    };

    contentApi.getContents = function (authToken, pageId) {
      return this.pagesWithAuthToken(authToken).one(pageId).one("contents")
        .get();
    };

    contentApi.updateContent = function (authToken, content) {
      return this.contentsWithAuthToken(authToken).one(content.id)
        .patch({ content: content });
    };

    // Public API here
    return contentApi;
  });