import gulp from 'gulp';
import util from 'gulp-util';
//import runSequence from 'run-sequence';

import Config from './tools/config';
import { loadTasks, loadCompositeTasks } from './tools/utils';

// --------------
// Clean dev/coverage that will only run once
// this prevents karma watchers from being broken when directories are deleted
let firstRun = true;
gulp.task('clean.once', (done) => {
    util.log('clean.once '+firstRun);
  if (firstRun) {
    firstRun = false;
    util.log('clean.once '+firstRun);
    gulp.series('check.tools', 'clean.dev', 'clean.coverage', (done)=>done());
    util.log('clean.once '+firstRun);
    return done();
  } else {
    util.log('Skipping clean on rebuild');
    return done();
  }
});

loadTasks(Config.SEED_TASKS_DIR);
loadTasks(Config.PROJECT_TASKS_DIR);

loadCompositeTasks(Config.SEED_COMPOSITE_TASKS, Config.PROJECT_COMPOSITE_TASKS);



