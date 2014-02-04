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
var env = require('..')({prefix: false, initialize: true, match: /^lc/i});
for(var z in env) {
  console.log(env.getKey(z) + '=%s', env[z]);   // => lowercase+underscore
}
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
