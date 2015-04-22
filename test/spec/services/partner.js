'use strict';

describe('Service: partner', function () {

  // load the service's module
  beforeEach(module('webAdminApp'));

  // instantiate service
  var partner;
  beforeEach(inject(function (_partner_) {
    partner = _partner_;
  }));

  it('should do something', function () {
    expect(!!partner).toBe(true);
  });

});
