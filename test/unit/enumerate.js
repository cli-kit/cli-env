var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should enumerate only set variables', function(done) {
    var env = environ({prefix: 'unit'});
    env.set('value', 'string');
    env.set('property_name', 'value');
    var keys = Object.keys(env);
    var enumerated = [];
    for(var z in env) {
      enumerated.push(z);
    }
    expect(keys).to.eql(enumerated).to.eql(['value', 'propertyName']);
    done();
  });
});
