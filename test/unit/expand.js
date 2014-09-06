var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should expand keys', function(done) {
    process.env.MOCK_EXPAND = 'test';
    var env = environ(
      {prefix: false, initialize: true, expand: {delimiter: '.'}});
    expect(env['mock.expand']).to.eql('test');
    done();
  });
});
