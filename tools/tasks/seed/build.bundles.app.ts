import { join } from 'path';
import * as Builder from 'systemjs-builder';

import Config from '../../config';

const BUNDLER_OPTIONS = {
  format: 'cjs',
  minify: false,
  sourceMaps: true,
  //sourceMapContents: true,
  mangle: false,
  //globalDefs: { DEBUG: true }
};

/**
 * Executes the build process, bundling the JavaScript files using the SystemJS builder.
 */
export default (done: any) => {
  let builder = new Builder(Config.SYSTEM_BUILDER_CONFIG);
  builder
    .buildStatic(join(Config.TMP_DIR, Config.BOOTSTRAP_PROD_MODULE),
      join(Config.JS_DEST, Config.JS_PROD_APP_BUNDLE),
      BUNDLER_OPTIONS)
    .then(() => done())
    .catch((err: any) => done(err));
};
