var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should initialize from environment', function(done) {
    process.env.NODE_ENV = 'test';
    process.env.npm_config_cache____foo='bar';
    var env = environ({prefix: false, initialize: true});
    expect(env.nodeEnv).to.eql('test');
    done();
  });
  it('should initialize from environment with regexp match', function(done) {
    process.env.UNIT_TEST_ENV = 'production';
    process.env.UNIT_TEST_UNDEFINED = undefined;
    var env = environ({prefix: false, initialize: true, match: /^unit_test_/i});
    expect(env.unitTestEnv).to.eql('production');
    var keys = Object.keys(env);
    expect(keys.length).to.eql(2);
    done();
  });
});
