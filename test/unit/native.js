var expect = require('chai').expect;
var environ = require('../..');

var delimiter = ',';
var json = true;

describe('cli-env:', function() {
  it('should set/get native values', function(done) {
    var env = environ({
      prefix: false, native: {delimiter: delimiter, json: json}});
    env.set('btrue', 'true');
    expect(env.btrue).to.eql(true);
    env.set('bfalse', 'false');
    expect(env.bfalse).to.eql(false);
    env.set('nulltype', 'null');
    expect(env.nulltype).to.eql(null);
    env.set('undef', 'undefined');
    expect(env.undef).to.eql(undefined);
    env.set('num', '-10');
    expect(env.num).to.eql(-10);
    env.set('arr', 'a,b,c');
    expect(env.arr).to.eql(['a', 'b', 'c']);
    env.set('nums', '1,2,3');
    expect(env.nums).to.eql([1,2,3]);
    env.set('obj', '{"arr":[1,2,3]}');
    expect(env.obj).to.eql({arr: [1,2,3]});
    env.set('str', 'value');
    expect(env.str).to.eql('value');
    done();
  });
  it('should get native values from environment', function(done) {
    process.env.btrue = 'true';
    process.env.bfalse = 'false';
    process.env.nulltype = 'null';
    process.env.undef = 'undefined';
    process.env.num = '-10';
    process.env.arr = 'a,b,c';
    process.env.nums = '1,2,3';
    process.env.obj = '{"arr":[1,2,3]}';
    process.env.str = 'value';
    var env = environ({
      initialize: true, prefix: false,
      native: {delimiter: delimiter, json: json}});
    expect(env.get('btrue')).to.eql(true);
    expect(env.get('bfalse')).to.eql(false);
    expect(env.nulltype).to.eql(null);
    expect(env.undef).to.eql(undefined);
    expect(env.num).to.eql(-10);
    expect(env.arr).to.eql(['a', 'b', 'c']);
    expect(env.nums).to.eql([1, 2, 3]);
    expect(env.obj).to.eql({arr: [1,2,3]});
    expect(env.str).to.eql('value');
    done();
  });
});
