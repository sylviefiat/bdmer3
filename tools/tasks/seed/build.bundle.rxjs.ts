/**
 * Temporary fix. See https://github.com/angular/angular/issues/9359
 */

const Builder = require('systemjs-builder');

export = (done: any) => {
  const options = {
    normalize: true,
    runtime: false,
    sourceMaps: true,
    //sourceMapContents: true,
    minify: true,
    mangle: false
  };
  var builder = new Builder('./');
  builder.config({
    paths: {
      'n:*': 'node_modules/*',
      'rxjs/*': 'node_modules/rxjs/*',
      'rxjs-compat/*': 'node_modules/rxjs-compat/*',
      'rxjs/internal-compatibility/*': 'node_modules/rxjs/internal-compatibility/*',
      'rxjs/testing/*': 'node_modules/rxjs/testing/*',
      'rxjs/ajax/*': 'node_modules/rxjs/ajax/',
      'rxjs/operators/*': 'node_modules/rxjs/operators/',
      'rxjs/observable/*': 'node_modules/rxjs/observable/',
      'rxjs/webSocket/*': 'node_modules/rxjs/webSocket/',
    },
    map: {
      'rxjs': 'n:rxjs',
      'rxjs-compat': 'n:rxjs-compat',
      'rxjs/internal-compatibility': 'n:rxjs/internal-compatibility',
      'rxjs/testing': 'n:rxjs/testing',
      'rxjs/ajax': 'n:rxjs/ajax',
      'rxjs/operators': 'n:rxjs/operators',
      'rxjs/observable/*': 'n:rxjs/observable/',
      'rxjs/webSocket': 'n:rxjs/webSocket',
    },
    packages: {
      'rxjs': {main: 'bundles/rxjs.umd.js', defaultExtension: 'js'},
      'rxjs-compat': {main: 'bundles/rxjs.umd.js', defaultExtension: 'js'},
      'rxjs/internal-compatibility': {main: 'index.js', defaultExtension: 'js'},
      'rxjs/testing': {main: 'index.js', defaultExtension: 'js'},
      'rxjs/ajax': {main: 'index.js', defaultExtension: 'js'},
      'rxjs/operators': {main: 'index.js', defaultExtension: 'js'},
      'rxjs/observable': {main: 'index.js', defaultExtension: 'js'},
      'rxjs/webSocket': {main: 'index.js', defaultExtension: 'js'},
    }
  });
  builder.bundle('rxjs', 'node_modules/.tmp/rxjs.min.js', options)
    .then(() => done())
    .catch((error:any) => done(error));
};
