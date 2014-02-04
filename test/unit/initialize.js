var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should initialize from environment', function(done) {
    process.env.NODE_ENV = 'test';
    var env = environ({prefix: 'unit', initialize: true});
    expect(env.nodeEnv).to.eql('test');
    //var keys = Object.keys(env);
    //console.dir(keys);
    done();
  });
});
