var expect = require('chai').expect;
var environ = require('../..');
var env = environ.env;

describe('cli-env:', function() {
  it('should walk complex object', function(done) {
    process.env.my = 'my';
    process.env.variable = 'value';
    var source = {
      my: '$my variable',
      value: 'my variable ${variable}',
      ignore: {
        num: 123,
        bool: false,
        nil: null,
        undef: undefined
      }
    };
    var expected = {
      my: 'my variable',
      value: 'my variable value',
      ignore: {
        num: 123,
        bool: false,
        nil: null,
        undef: undefined
      }
    };
    env(source);
    expect(source).to.eql(expected);
    done();
  });
});
