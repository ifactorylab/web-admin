'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.main = {
      title: 'Bazaar',
      settings: {
        navbarHeaderColor: 'scheme-light',
        sidebarColor: 'scheme-light',
        brandingColor: 'scheme-light',
        activeColor: 'cyan-scheme-color',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };

    $scope.ajaxFaker = function(){
      $scope.data=[];
      var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=5&callback=JSON_CALLBACK';

      $http.jsonp(url).success(function(data){
        $scope.data=data;
        console.log('cecky');
        angular.element('.tile.refreshing').removeClass('refreshing');
      });
    };
  });