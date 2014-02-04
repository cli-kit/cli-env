var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should use custom transform functions', function(done) {
    var env;
    var conf = {
      prefix: 'unit',
      transform: {
        key: function(key) {
          expect(this).to.equal(env);
          key = key.replace(/- /, this.conf.delimiter);
          key = key.replace(/[^a-zA-Z0-9_]/, '');
          return this.conf.prefix + this.conf.delimiter + key.toLowerCase()
        },
        value: function(key) {
          expect(this).to.equal(env);
          return process.env[key] || this[key];
        }
      }
    }
    env = environ(conf);
    env.set('value', 'string');
    expect(env.get('value')).to.eql('string');
    done();
  });
});
