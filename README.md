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

## API

```javascript
process.env.NODE_ENV = 'test';
var env = require('cli-env')({prefix: 'program'});
env.get('NODE_ENV');                            // => test
env.set('highlight-syntax', true);
console.log(env.highlightSyntax);               // => true
```

## License

Everything is [MIT](http://en.wikipedia.org/wiki/MIT_License). Read the [license](/LICENSE) if you feel inclined.
