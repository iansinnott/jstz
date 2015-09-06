var expect = require('chai').expect;
var jstz = require('./');

/**
 * TODO: It would be ideal to utilize the python tests within
 * ./utilities/dst.py. We aren't yet actually testing any functionality, just
 * API shape.
 */
describe('API', function() {
  it('Should have a "determine" method.', function () {
    expect(jstz).to.respondTo('determine');
  });
  it('Timezone instance has a name method that returns a string', function() {
    var timezone = jstz.determine();
    expect(timezone).to.respondTo('name');
    expect(timezone.name()).to.be.a('string');
  });
});

