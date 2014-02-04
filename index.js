var basename = require('path').basename;
var events = require('events');
var util = require('util');
var merge = require('cli-util').merge;
var camelcase = require('cli-util').camelcase;

var defaults = {
  prefix: basename(process.argv[1]),
  delimiter: '_',
  transform: {
    key: null,
    value: null
  }
}

/**
 *  Helper class for accessing environment variables
 *  using a defined prefix.
 */
var Environment = function(conf) {
  Object.defineProperty(this, 'conf',
    {
      enumerable: false,
      configurable: false,
      writable: false,
      value: conf
    }
  );
}

util.inherits(Environment, events.EventEmitter);

/**
 *  Retrieve a suitable key for setting an environment
 *  variable.
 *
 *  @param key The candidate key.
 *
 *  @return A converted key.
 */
Environment.prototype.getKey = function(key) {
  key = key.replace(/- /, this.conf.delimiter);
  key = key.replace(/[^a-zA-Z0-9_]/, '');
  return this.conf.prefix + this.conf.delimiter + key.toLowerCase()
}

Environment.prototype.getValue = function(key) {
  return process.env[key] || this[key];
}

/**
 *  Set an environment variable using the transform
 *  set function.
 *
 *  @param key The variable key.
 *  @param value The variable value.
 */
Environment.prototype.set = function(key, value) {
  var transform = this.conf.transform.key;
  if(typeof(transform) == 'function') {
    key = transform.call(this, key);
  }else{
    key = this.getKey(key);
  }
  var k  = key.replace(
    new RegExp('^' + this.conf.prefix + this.conf.delimiter), '');
  this[camelcase(k, this.conf.delimiter)] = process.env[key] = value;
}

/**
 *  Get an environment variable using the transform
 *  get function.
 *
 *  @param key The variable key.
 *
 *  @return The variable value.
 */
Environment.prototype.get = function(key) {
  var transform = this.conf.transform.key, value;
  if(typeof(transform) == 'function') {
    key = transform.call(this, key);
  }
  transform = this.conf.transform.value;
  if(typeof(transform) == 'function') {
    value = transform.call(this, key);
  }else{
    value = this.getValue(key);
  }
  return value || process.env[key] || this[key];
}

module.exports = function(conf) {
  conf = merge(conf, defaults);
  var env = new Environment(conf);
  return env;
}
