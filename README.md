# Environment

Environment variable management.

This module is designed for command line interfaces that wish to access a set of prefixed environment variables to indicate preferences or default values for common arguments, however, it is quite flexible and could be used for a variety of purposes.

## Install

```
npm install cli-env
```

## Test

```
npm test
```

## Features

* Convenient access to environment variables
* Enumeration safe implementation
* Loading environment variable subsets
* JSON safe data structure
* Native type coercion support
* 100% code coverage

## Examples

Manage a set of prefixed variables:

```javascript
var env = require('..')({prefix: 'pkg'});
env.set('directory', '/usr/local/packages');
console.log(env.directory);
console.log(env.get('directory'));
console.log(process.env.pkg_directory);
```

Import all environment variables:

```javascript
var env = require('..')({prefix: false, initialize: true});
for(var z in env) {
  console.log(z + '=%s', env[z]);               // => camelcase keys
}
```

Import a subset of environment variables matching a regular expression:

```javascript
var env = require('..')({
  prefix: false, initialize: true, match: /^lc_/i});
for(var z in env) {
  console.log(env.getKey(z) + '=%s', env[z]);   // => lowercase+underscore
}
```

Native type coercion:

```javascript
process.env.type_tbool = 'true';
process.env.type_fbool = 'false';
process.env.type_null = 'null';
process.env.type_num = '3.14';
process.env.type_nums = '1,2,3';
process.env.type_str = 'value';
var env = require('..')({
  prefix: 'type', initialize: true, match: /^type_/i,
  native: {delimiter: ','}
});
console.log(JSON.stringify(env, undefined, 2));
```

```json
{
  "tbool": true,
  "fbool": false,
  "null": null,
  "num": 3.14,
  "nums": [
    1,
    2,
    3
  ],
  "str": "value"
}
```

## Configuration

```javascript
{
  prefix: basename(process.argv[1]),
  delimiter: '_',
  initialize: false,
  match: null,
  transform: {
    key: null,
    value: null,
    name: null
  },
  expand: {
    delimiter: null,
    transform: function(key) {
      return key.toLowerCase();
    }
  },
  native: null
}
```

* `prefix`: The string prefix for environment variables.
* `delimiter`: The string delimiter for environment variable names.
* `initialize`: A boolean indicating whether the instance should import the environment variables at instantiation.
* `match`: A regular expression used to filter the environment variables to import.
* `transform`: An object containing functions that may be used to override the default logic for determining variable keys, retrieving variable values and getting property names. All functions are invoked in the scope of the `Environment` instance.
* `native`: If present this object indicates that type conversion should be done from string values to native types.
* `expand`: An object that controls whether keys are expanded, use this when you wish to convert the default camel case keys to use a different delimiter (such as a period '.').
* `expand.delimiter`: String delimiter to use when converting from camel case.
* `expand.transform`: A transform function to invoke when expanding keys, default implementation converts the key to lowercase.

### transform.key(key)

When the `set` and `get` methods are called this function if defined will be invoked.

It is parsed the raw key value and should return a mutated key suitable for setting an environment variable.

### transform.value(key, name, raw)

If defined this method is invoked from `get` and passed the mutated key (returned by `transform.key()`), the property name (returned by `transform.name()`) and the raw value passed to `get`, it should return the value for the property.

### transform.name(key)

Determines the property name for a variable on the `Environment` instance. This method is passed the raw key from `set` or `get` and should return the name of the property.

### native.delimiter

The string (or regular expression) delimiter to use when converting strings to arrays.

### native.json

A boolean indicating that type conversion should also be done for strings that appear to be JSON. Use this with caution.

## Module

### env([conf])

Create a new `Environment` instance merging the `conf` parameter with the default configuration.

## Environment

The `Environment` class provides access to reading, writing and loading variables from the environment. All internal properties and methods of the class are marked read-only so some variable names will not be set. These include the public methods and properties listed below as well as the private methods `getKey`, `getValue` and `getName`.

### new Environment([conf])

Create a new `Environment` instance with the specified configuration.

* `conf`: The configuration for the environment.

### conf

The object representing the environment configuration.

### get(key)

Get the value of a variable.

* `key`: The name of the variable.

### load(match)

Load variables from the environment into the instance.

* `match`: A regular expression used to test which variables to import, use this to import a subset of the environment variables.

### set(key, value)

Set the value of a variable.

* `key`: The name of the variable.
* `value`: The value for the variable.

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
