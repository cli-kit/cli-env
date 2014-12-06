var expect = require('chai').expect;
var environ = require('../..');

describe('cli-env:', function() {
  it('should ignore invalid argument', function(done) {
    expect(environ.replace(undefined)).to.eql(undefined);
    done();
  });
  it('should ignore non-matching string', function(done) {
    expect(environ.replace('my value')).to.eql('my value');
    done();
  });
  it('should ignore non-existent variable', function(done) {
    expect(environ.replace('my ${non_existent_variable}'))
      .to.eql('my ${non_existent_variable}');
    done();
  });
  it('should ignore multiple non-existent variables', function(done) {
    expect(environ.replace('my ${non_existent_variable} ${invalid}'))
      .to.eql('my ${non_existent_variable} ${invalid}');
    done();
  });
  it('should ignore escaped variable', function(done) {
    process.env.escaped = 'value';
    expect(environ.replace('my \\${escaped}'))
      .to.eql('my ${escaped}');
    delete process.env.escaped;
    done();
  });
  it('should replace escaped variable with escaping disabled', function(done) {
    process.env.escaped = 'value';
    expect(environ.replace('my \\${escaped}', null, false))
      .to.eql('my \\value');
    delete process.env.escaped;
    done();
  });
  it('should replace variable', function(done) {
    process.env.variable = 'value';
    expect(environ.replace('my ${variable}'))
      .to.eql('my value');
    delete process.env.variable;
    done();
  });
  it('should replace simple variable (no braces)', function(done) {
    process.env.variable = 'value';
    expect(environ.replace('my $variable'))
      .to.eql('my value');
    delete process.env.variable;
    done();
  });
  it('should replace multiple variables', function(done) {
    process.env.my = 'my';
    process.env.variable = 'value';
    expect(environ.replace('${my} new ${variable}'))
      .to.eql('my new value');
    delete process.env.my;
    delete process.env.variable;
    done();
  });
  it('should replace multiline variables', function(done) {
    process.env.my = 'my';
    process.env.variable = 'value';
    expect(environ.replace('${my} \nnew ${variable}'))
      .to.eql('my \nnew value');
    delete process.env.my;
    delete process.env.variable;
    done();
  });
  it('should mix valid and invalid variables', function(done) {
    process.env.my = 'my';
    process.env.variable = 'value';
    expect(environ.replace('${my} ${new} ${variable}'))
      .to.eql('my ${new} value');
    delete process.env.my;
    delete process.env.variable;
    done();
  });

  it('should throw error with strict enabled', function(done) {
    function fn() {
      environ.replace('my ${non_existent_variable}', {}, true, null, true);
    }
    expect(fn).throws(Error);
    done();
  });
});
