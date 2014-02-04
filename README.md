# Environment

Environment variable management.

## Install

```
npm install cli-env
```

## Test

```
npm test
```

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

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
