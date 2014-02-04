var basename = require('path').basename;
var merge = require('cli-util').merge;
var camelcase = require('cli-util').camelcase;
var delimited = require('cli-util').delimited;

var defaults = {
  prefix: basename(process.argv[1]),
  delimiter: '_',
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
  return this.conf.prefix + this.conf.delimiter + key.toLowerCase()
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
  if(typeof(this.conf.transform.name) == 'function') {
    return this.conf.transform.name.call(this, key);
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
  return value || process.env[key] || this[this.getPropertyName(key)];
}


/**
 *  Convert the environment variables to a string
 *  representation suitable for an rc file.
 *
 *  @param exports Whether to include the exports prefix.
 */
function toExports(exports) {
  var str ='';
  var z, k, v, s;
  for(z in this) {
    // TODO: convert from property name (camelcase) tp underscore delimited
    k = this.getKey(z);
    v = this[z];
    s = k + '=\'' + v + '\';';
    if(exports) {
      s = 'export ' + s;
    }
    str += s + '\n';
  }
  return str.trim();
}

var methods = {
  getKey: getKey,
  getValue: getValue,
  getPropertyName: getPropertyName,
  get: get,
  set: set,
  toExports: toExports
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
  conf = merge(conf, defaults);
  var env = new Environment(conf);
  return env;
}
