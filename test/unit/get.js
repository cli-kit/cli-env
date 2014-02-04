var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should get variable', function(done) {
    var env = environ({prefix: 'unit'});
    env.set('value', 'string');
    expect(env.get('value')).to.eql('string');
    done();
  });
  it('should get variable on instance', function(done) {
    var env = environ({prefix: 'unit'});
    env.set('value', 'string');
    expect(env.value).to.eql('string');
    console.dir(env);
    done();
  });
  it('should get unknown variable', function(done) {
    var env = environ({prefix: 'unit'});
    expect(env.get('NODE_ENV')).to.eql(undefined);
    done();
  });
});
