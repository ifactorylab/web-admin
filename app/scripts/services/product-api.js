'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.productApi
 * @description
 * # productApi
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('productApi', function (Restangular) {
    var apiURL = 'http://service-product.herokuapp.com';
    // var apiURL = 'http://localhost:3000';

    var productApi = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(apiURL);
    });

    productApi.withAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer
          .setDefaultHeaders({ 'Venice-Authorization': authToken });
      });
    };

    productApi.sitesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service('sites');
    };

    productApi.categoriesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service('categories');
    };

    productApi.productsWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service('products');
    };

    productApi.productImagesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service('product_images');
    };

    productApi.createCategory = function (authToken, siteId, category) {
      return this.sitesWithAuthToken(authToken).one(siteId).all('categories')
        .post({category: category});
    };

    productApi.getCategories = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId)
        .one('categories').get();
    };

    productApi.createProduct = function (authToken, siteId, product) {
      return this.sitesWithAuthToken(authToken).one(siteId).all('products')
        .post({product: product});
    };

    productApi.getProducts = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId)
        .one('products').get();
    };

    productApi.updateProduct = function (authToken, product) {
      return this.productsWithAuthToken(authToken).one(product.id)
        .patch({ product: product });
    };

    productApi.deleteProduct = function (authToken, productId) {
      return this.productsWithAuthToken(authToken).one(productId).remove();
    };

    productApi.deleteImage = function(authToken, imageId) {
      return this.productImagesWithAuthToken(authToken).one(imageId).remove();
    };
    // Public API here
    return productApi;
  });