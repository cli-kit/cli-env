var camelcase = require('cli-util').camelcase;
var expect = require('chai').expect;
var environ = require('../..');
var delimited = require('cli-util').delimited;

describe('cli-env:', function() {
  it('should use custom transform functions', function(done) {
    var full = 'unit_test_variable';
    var name = 'test_variable';
    var prop = 'testVariable';
    var env;
    var conf = {
      prefix: 'unit',
      transform: {
        key: function(key) {
          expect(this).to.equal(env);
          expect(key).to.equal(name);
          key = delimited(key, this.conf.delimiter);
          key = key.replace(/- /, this.conf.delimiter);
          key = key.replace(/[^a-zA-Z0-9_]/, '');
          if(this.conf.prefix) {
            return this.conf.prefix + this.conf.delimiter + key.toLowerCase()
          }
          return key.toLowerCase();
        },
        value: function(key, property, raw) {
          expect(this).to.equal(env);
          expect(key).to.equal(full);
          expect(raw).to.eql(name);
          expect(property).to.eql(prop);
          return process.env[key] || this[property];
        },
        name: function(key) {
          expect(this).to.equal(env);
          expect(key).to.eql(name);
          if(this.conf.prefix) {
            key = key.replace(this.conf.prefix + '_', '');
          }
          return camelcase(key, this.conf.delimiter)
        }
      }
    }
    env = environ(conf);
    env.set(name, 'string');
    expect(env[prop]).to.eql('string');
    expect(process.env[full]).to.eql('string');
    expect(env.get(name)).to.eql('string');
    done();
  });
});
