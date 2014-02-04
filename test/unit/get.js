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
    //console.dir(env);
    done();
  });
  it('should get variable on instance (camelcase)', function(done) {
    var env = environ({prefix: 'unit'});
    env.set('highlight_syntax', 'true');
    expect(env.highlightSyntax).to.eql('true');
    //var s = JSON.stringify(env);
    done();
  });
  it('should get unknown variable', function(done) {
    var env = environ({prefix: 'unit'});
    expect(env.get('NODE_ENV')).to.eql(undefined);
    done();
  });
  it('should get variable from environment', function(done) {
    process.env.NODE_ENV = 'test';
    var env = environ({prefix: 'unit'});
    expect(env.get('NODE_ENV')).to.eql('test');
    done();
  });
});
