'use strict';

describe('Controller: PagesSitesCtrl', function () {

  // load the controller's module
  beforeEach(module('webAdminApp'));

  var PagesSitesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PagesSitesCtrl = $controller('PagesSitesCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
