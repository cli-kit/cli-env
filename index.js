var basename = require('path').basename;
var merge = require('cli-util').merge;
var utils = require('cli-util');
var camelcase = utils.camelcase;
var delimited = utils.delimited;
var native = utils.native;

var defaults = {
  prefix: basename(process.argv[1]),
  delimiter: '_',
  initialize: false,
  match: null,
  transform: {
    key: null,
    value: null,
    name: null
  }
}

/**
 *  Helper class for accessing environment variables
 *  using a defined prefix.
 *
 *  @param conf The configuration object.
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
  if(conf.initialize) {
    for(var z in process.env) {
      if(conf.match instanceof RegExp) {
        if(conf.match.test(z)) {
          this.set(z.toLowerCase(), process.env[z]);
        }
      }else{
        this.set(z.toLowerCase(), process.env[z]);
      }
    }
  }
}

/**
 *  Retrieve a suitable key for setting an environment
 *  variable.
 *
 *  @api private
 *
 *  @param key The candidate key.
 *
 *  @return A converted key.
 */
function getKey(key) {
  if(typeof(this.conf.transform.key) == 'function') {
    return this.conf.transform.key.call(this, key);
  }
  key = delimited(key, this.conf.delimiter);
  key = key.replace(/- /, this.conf.delimiter);
  key = key.replace(/[^a-zA-Z0-9_]/, '');
  if(this.conf.prefix) {
    return this.conf.prefix + this.conf.delimiter + key.toLowerCase()
  }
  return key.toLowerCase();
}

/**
 *  Retrieve the value of a variable from the environment.
 *
 *  @api private
 *
 *  @param key The key that has already been passed through
 *  the key transformation function.
 *  @param property The name of a property corresponding to the key.
 *
 *  @return The value of the environment variable.
 */
function getValue (key, property) {
  if(typeof(this.conf.transform.value) == 'function') {
    return this.conf.transform.value.call(this, key);
  }
  return process.env[key] || this[property];
}

/**
 *  Convert a key into a property name.
 *
 *  @param key The property key.
 *
 *  @return A camel case property name.
 */
function getPropertyName(key) {
  if(key == '_') return key;
  if(typeof(this.conf.transform.name) == 'function') {
    return this.conf.transform.name.call(this, key);
  }
  if(this.conf.prefix) {
    key = key.replace(this.conf.prefix + '_', '');
  }
  return camelcase(key, this.conf.delimiter)
}

/**
 *  Set an environment variable using the transform
 *  set function.
 *
 *  @param key The variable key.
 *  @param value The variable value.
 */
function set(key, value) {
  var k = this.getKey(key);
  var name = this.getPropertyName(key);
  if(this.conf.native && typeof(value) == 'string') {
    try {
      value = native.to(
        value, this.conf.native.delimiter, this.conf.native.json);
    }catch(e){}
  }
  this[name] = process.env[k] = value;
}

/**
 *  Get an environment variable using the transform
 *  get function.
 *
 *  @param key The variable key.
 *
 *  @return The variable value.
 */
function get(key) {
  var k = this.getKey(key);
  var value = this.getValue(k);
  value = value || process.env[key] || this[this.getPropertyName(key)];
  if(this.conf.native && typeof(value) == 'string') {
    value = native.to(
      value, this.conf.native.delimiter, this.conf.native.json);
  }
  return value;
}

var methods = {
  getKey: getKey,
  getValue: getValue,
  getPropertyName: getPropertyName,
  get: get,
  set: set
}

for(var z in methods) {
  Object.defineProperty(Environment.prototype, z,
    {
      enumerable: false,
      configurable: false,
      writable: false,
      value: methods[z]
    }
  )
}

module.exports = function(conf) {
  var c = merge(defaults, {});
  var env = new Environment(merge(conf, c));
  return env;
}

module.exports.Environment = Environment;
