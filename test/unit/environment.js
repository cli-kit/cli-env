var expect = require('chai').expect;
var environ = require('../..');
var Environment = environ.Environment;

describe('cli-env:', function() {
  it('should handle environment instance with no configuration',
    function(done) {
      var env = new Environment();
      env.set('variable', 'value');
      expect(env.variable).to.eql('value');
      expect(env.get('variable')).to.eql('value');
      expect(process.env.variable).to.eql('value');
      done();
    }
  );
});
