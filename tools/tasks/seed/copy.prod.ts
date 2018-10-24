import * as gulp from 'gulp';
import { join } from 'path';
import * as util from 'gulp-util';

import Config from '../../config';

/**
 * Executes the build task, copying all TypeScript files over to the `dist/tmp` directory.
 */
export = () => {
   var src = [
      join(Config.APP_SRC, '**/*.ts'),
      join(Config.APP_SRC, '**/*.json'),
      '!' + join(Config.APP_SRC, '**/*.spec.ts'),
      '!' + join(Config.APP_SRC, '**/*.e2e-spec.ts')
    ];
   util.log(src);
    return gulp.src(src).pipe(gulp.dest(Config.TMP_DIR));
};
