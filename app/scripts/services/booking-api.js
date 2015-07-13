'use strict';

/**
 * @ngdoc service
 * @name webAdminApp.bookingApi
 * @description
 * # bookingApi
 * Service in the webAdminApp.
 */
angular.module('webAdminApp')
  .service('bookingApi', function (Restangular) {
    var apiURL = 'http://service-site.herokuapp.com';

    var bookingApi = Restangular.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl(apiURL);
    });

    bookingApi.withAuthToken = function (authToken) {
      return this.withConfig(function(RestangularConfigurer) {
        RestangularConfigurer
          .setDefaultHeaders({ 'Venice-Authorization': authToken })
      });
    };

    bookingApi.sitesWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service("sites");
    };

    bookingApi.bookingsWithAuthToken = function (authToken) {
      return this.withAuthToken(authToken).service("bookings");
    };

    bookingApi.getBookings = function (authToken, siteId) {
      return this.sitesWithAuthToken(authToken).one(siteId)
        .one("bookings").get();
    };

    bookingApi.confirmBooking = function (authToken, booking) {
      return this.bookingsWithAuthToken(authToken).one(booking.id)
        .one("confirm").patch({ });
    };

    bookingApi.rejectBooking = function (authToken, booking) {
      return this.bookingsWithAuthToken(authToken).one(booking.id)
        .one("reject").patch({ });
    };

    bookingApi.deleteBooking = function (authToken, booking) {
      return this.bookingsWithAuthToken(authToken).one(booking.id).remove();
    };

    return bookingApi;
  });