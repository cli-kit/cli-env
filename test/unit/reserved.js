var expect = require('chai').expect;
var environ = require('../..');
var Environment = environ.Environment;

describe('cli-env:', function() {
  it('should ignore attempts to set reserved property names',
    function(done) {
      var env = new Environment();
      env.set('conf', 'value');
      env.set('set', 'value');
      env.set('get', 'value');
      env.set('load', 'value');
      env.set('getKey', 'value');
      env.set('getValue', 'value');
      env.set('getName', 'value');
      expect(env.conf).to.eql({});
      expect(env.set).to.be.a('function');
      expect(env.get).to.be.a('function');
      expect(env.load).to.be.a('function');
      expect(env.getKey).to.be.a('function');
      expect(env.getValue).to.be.a('function');
      expect(env.getName).to.be.a('function');
      done();
    }
  );
});
