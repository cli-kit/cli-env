var basename = require('path').basename;
var merge = require('cli-util').merge;
var native = require('cli-native');
var utils = require('cli-util');
var camelcase = utils.camelcase;
var delimited = utils.delimited;

var defaults = {
  prefix: basename(process.argv[1]),
  delimiter: '_',
  initialize: false,
  match: null,
  transform: {
    key: null,
    value: null,
    name: null
  },
  native: null
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
      value: conf || {}
    }
  );
  if(this.conf.initialize) {
    this.load();
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
  if(this.conf.transform) {
    if(typeof(this.conf.transform.key) == 'function') {
      return this.conf.transform.key.call(this, key);
    }
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
 *  @param raw The raw untouched key.
 *
 *  @return The value of the environment variable.
 */
function getValue (key, name, raw) {
  if(this.conf.transform) {
    if(typeof(this.conf.transform.value) == 'function') {
      return this.conf.transform.value.call(this, key, name, raw);
    }
  }
  var value = process.env[raw] || this[name];
  if(this.conf.native && typeof(value) == 'string') {
    value = native.to(
      value, this.conf.native.delimiter, this.conf.native.json);
  }
  return value;
}

/**
 *  Convert a key into a property name.
 *
 *  @param key The property key.
 *
 *  @return A camel case property name.
 */
function getName(key) {
  if(key == '_') return key;
  if(this.conf.transform) {
    if(typeof(this.conf.transform.name) == 'function') {
      return this.conf.transform.name.call(this, key);
    }
  }
  if(this.conf.prefix) {
    key = key.replace(this.conf.prefix + '_', '');
  }
  // guard against silly variables such as npm_config_cache____foo
  key = key.replace(
    new RegExp(this.conf.delimiter + '+', 'g'), this.conf.delimiter);

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
  var name = this.getName(key);
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
  var name = this.getName(key);
  var value = this.getValue(k, name, key);
  return value;
}

/**
 *  Load variables from the environment into this
 *  instance.
 *
 *  @param match A regular expression test determining
 *  which variables to load.
 */
function load(match) {
  match = match || this.conf.match;
  for(var z in process.env) {
    if(match instanceof RegExp) {
      if(match.test(z)) {
        this.set(z.toLowerCase(), process.env[z]);
      }
    }else{
      this.set(z.toLowerCase(), process.env[z]);
    }
  }
}

/**
 *  Performs substitution of environment variables within
 *  strings. The substitution format is:
 *
 *    $variable or ${variable}
 *
 *  @param str The target sring value.
 *  @param env An object containing environment variables
 *  default is process.env.
 *  @param escaped Whether escaped dollars indicate replacement
 *  should be ignored.
 */
function replace(str, env, escaped) {
  if(!str) return str;
  var re = /(\\?)\$\{?(\w+)\}?/g;
  if(!re.test(str)) return str;
  env = env || process.env;
  escaped = escaped === undefined ? true : escaped;
  re.lastIndex = 0;
  //console.log(str);
  var result, name, before, suffix, end, value;
  while(result = re.exec(str)) {
    //console.dir(result);
    value = result[0];
    before = '';
    name = result[2];
    if(env[name]) {
      value = env[name];
      before = result[1];
    }
    if(escaped && result[1] === '\\') {
      value = result[0].substr(1);
      before = '';
    }
    start = str.substr(0, result.index) + before;
    end = str.substr(result.index + result[0].length);
    str = start + value + end;
  }
  return str;
}

var methods = {
  getKey: getKey,
  getValue: getValue,
  getName: getName,
  get: get,
  set: set,
  load: load
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
module.exports.replace = replace;
