var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should set variable', function(done) {
    var env = environ({prefix: 'unit'});
    env.set('value', 'string');
    //expect(process.env.unit_value).to.eql('string');
    done();
  });
});
