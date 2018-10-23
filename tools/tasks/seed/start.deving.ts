import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';

import Config from '../../config';

const plugins = <any>gulpLoadPlugins();

import { notifyLiveReload } from '../../utils';

function watchAppFiles(path: string, fileChangeCallback: (e: any, done: () => void) => void) {

  let paths: string[] = [
    join(Config.APP_SRC, path)
  ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

  let busyWithCall : boolean = false;
  let changesWaiting : any = null;
  let afterCall = () => {
    busyWithCall = false;
    if (changesWaiting) {
      fileChangeCallback(changesWaiting, afterCall);
      changesWaiting = null;
    }
  };
  plugins.watch(paths, (e: any) => {
    if (busyWithCall) {
      changesWaiting = e;
      return;
    }
    busyWithCall = true;
    fileChangeCallback(e, afterCall);
  });

}

gulp.task('watch.while_deving', function () {
  watchAppFiles('**/!(*.ts)', (e: any, done: any) =>
    gulp.series('build.assets.dev', 'build.html_css', 'build.index.dev', () => { notifyLiveReload(e); done(); }));
  watchAppFiles('**/(*.ts)', (e: any, done: any) =>
    gulp.series('build.js.dev', 'build.index.dev', () => {
      notifyLiveReload(e);
      gulp.series('build.js.test', 'karma.run.with_coverage', done);
    }));
});

export = gulp.series('build.test',
    'watch.while_deving',
    'server.start',
    'karma.run.with_coverage',
    'serve.coverage.watch');
