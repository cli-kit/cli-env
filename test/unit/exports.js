var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should get environment variable string', function(done) {
    var expected = 'unit_value=\'string\';';
    var env = environ({prefix: 'unit'}), s;
    env.set('value', 'string');
    s = env.toExports(false);
    expect(s).to.eql(expected);
    expected = 'export ' + expected + '\n';
    expected += 'export unit_highlight_syntax=\'true\';';
    env.set('highlightSyntax', true);
    s = env.toExports(true);
    expect(s).to.eql(expected);
    done();
  });
});
