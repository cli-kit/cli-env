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

Import all environment variables:

```javascript
var env = require('..')({prefix: false, initialize: true);
for(var z in env) {
  //console.log(z + '=%s', env[z]);             // => camelcase keys
  console.log(env.getKey(z) + '=%s', env[z]);   // => lowercase+underscore
}
```

Import a subset of environment variables matching a regular expression:

```javascript
var env = require('..')({prefix: false, initialize: true, match: /^lc/i});
for(var z in env) {
  //console.log(z + '=%s', env[z]);             // => camelcase keys
  console.log(env.getKey(z) + '=%s', env[z]);   // => lowercase+underscore
}
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
