'use strict';

/**
 * @ngdoc function
 * @name webAdminApp.controller:PagesSitesCtrl
 * @description
 * # PagesSitesCtrl
 * Controller of the webAdminApp
 */
angular.module('webAdminApp')
  .controller('SitesCtrl', function ($rootScope, $scope, $modal, storage, siteApi) {
    $scope.page = {
      title: 'Sites',
      subtitle: 'Place subtitle here...'
    };

    $scope.authToken = storage.get("auth_token");
    siteApi.index($scope.authToken).then(function(data) {
      $scope.sites = data.sites;
    }, function(response) {
      var message = 'Something bad happened :(';
      if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
        message = response.data.error.message;
      }

      // $scope.showAlert(message, 'danger', 'fa-warning');
    });

    $scope.createSite = function(site) {
      console.log(site);
      if (site.id) {
        $scope.steps.step2 = true;
      } else {
        siteApi.create($scope.authToken, site).then(function(data) {
          $scope.steps.step2=true;
          $scope.site = site;
          $scope.site.id = data.site.id;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }

          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }
    };

    $scope.openSite = function(site) {
      siteApi.show($scope.authToken, site.id).then(function(data) {
        console.log(data.site);
        var site = data.site;
        var business;
        if (site) {
          business = site.business;
        }
        var hours;
        if (business) {
          hours = business.hours;
        }

        if (site && site.id) {
          $scope.newSite(site, business, hours);
        }
      }, function(response) {
        var message = 'Something bad happened :(';
        if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
          message = response.data.error.message;
        }

        // $scope.showAlert(message, 'danger', 'fa-warning');
      });
    };

    $scope.newSite = function(site, business, hours) {
      $scope.modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'SiteModalInstanceCtrl',
        size: 'lg',
        resolve: {
          items: function () {
            return $scope.items;
          },
          site: function () {
            return site;
          },
          business: function () {
            return business;
          },
          hours: function () {
            return hours;
          }
        }
      });

      $scope.modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        console.log('Modal dismissed at: ' + new Date());
      });
    }

    $scope.createBusiness = function(business) {
      if (business.id) {
        $scope.steps.step3 = true;
      } else {
        siteApi.createBusiness($scope.authToken, $scope.site.id, business).then(function(data) {
          $scope.steps.step3=true;
          $scope.business = business;
          $scope.business.id = data.business.id;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }

          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }
    }

    $scope.createHours = function(hours) {
      // console.log($scope.hoursObjects);
      for (var day in hours) {
        var tokens = (hours[day] != "" ? hours[day].split(",") : []);
        if ($scope.hoursObjects[day]) {
          var obj = $scope.hoursObjects[day];
          if (tokens.length < obj.length) {
            for (var i = tokens.length; i < obj.length; i++) {
              obj[i]["action"] = "delete";
            }
          }

          for (var key in tokens) {
            if (obj[key]) {
              if (obj[key].text != tokens[key]) {
                obj[key]["action"] = "update";
                obj[key].text = tokens[key];
              }
            } else {
              obj.push({ "text": tokens[key], "action": "create" });
            }
          }
        } else {
          if (hours[day]) {
            $scope.hoursObjects[day] = [];
            for (var key in tokens) {
              $scope.hoursObjects[day].push({ "text": tokens[key], "action": "create" });
            }
          }
        }
      }

      if (hours) {
        siteApi.createHours($scope.authToken, $scope.business.id, $scope.hoursObjects).then(function(data) {
          $scope.steps.step4 = true;
        }, function(response) {
          var message = 'Something bad happened :(';
          if ((response.status === 401 || response.status === 422) && response.data && response.data.error) {
            message = response.data.error.message;
          }
          // $scope.showAlert(message, 'danger', 'fa-warning');
        });
      }

      $scope.ok();
    }

    $scope.tileColor = function(site) {
      if (site.status === 'live') {
        return "bg-greensea";
      } else if (site.status === 'development') {
        return "bg-blue";
      } else {
        return "dvd dvd-btm";
      }
    }

    $scope.cols = function(index) {
      if (!$scope.sites) {
        return [];
      }
      var begin = index * 3;
      return $scope.sites.slice(begin, begin + 3);
    };

    $scope.rows = function() {
      if (!$scope.sites) {
        return 0;
      }
      return Math.ceil($scope.sites.length / 3);
    };

    $scope.range = function(n) {
        return new Array(n);
    };
  })
  .controller('SiteModalInstanceCtrl', function ($scope, $modalInstance, items, site, business, hours) {

    $scope.items = items;
    $scope.selected = {
      // item: $scope.items[0]
    };

    $scope.site = site;
    if (site) {
      $scope.site.domain = "http://" + site.domain;
      $scope.siteName = site.name;
    } else {
      $scope.siteName = "New Site";
    }

    $scope.mergeHoursText = function(hours) {
      var text = [];
      for (var key in hours) {
        text.push(hours[key].text);
      }
      return text.join(", ");
    }

    var week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

    $scope.business = business;
    $scope.hoursObjects = hours;
    if (hours) {
      $scope.hours = {};
      for (var key in week) {
        $scope.hours[week[key]] = $scope.mergeHoursText(hours[week[key]]);
      }
    }

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
  .controller('BusinessMapCtrl', function ($scope) {
    $scope.map = {center: {latitude: 51.219053, longitude: 4.404418 }, zoom: 14 };
    $scope.options = {scrollwheel: false};
    $scope.drawingManagerOptions = {
      drawingMode: google.maps.drawing.OverlayType.MARKER,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER,
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.POLYLINE,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      },
      circleOptions: {
        fillColor: '#ffff00',
        fillOpacity: 1,
        strokeWeight: 5,
        clickable: false,
        editable: true,
        zIndex: 1
      }
    };
    $scope.markersAndCircleFlag = true;
    $scope.drawingManagerControl = {};
    $scope.$watch('markersAndCircleFlag', function() {
      if (!$scope.drawingManagerControl.getDrawingManager) {
        return;
      }
      var controlOptions = angular.copy($scope.drawingManagerOptions);
      if (!$scope.markersAndCircleFlag) {
        controlOptions.drawingControlOptions.drawingModes.shift();
        controlOptions.drawingControlOptions.drawingModes.shift();
      }
      $scope.drawingManagerControl.getDrawingManager().setOptions(controlOptions);
    });
  });
