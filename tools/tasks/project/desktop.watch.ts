import * as gulp from 'gulp';
//import * as runSequence from 'run-sequence';

const electron = require('electron-connect').server.create({ 'path': 'dist/dev' });

export = () => {
  electron.start();
  gulp.watch(['./src/**/*'], reload);
  //done();
};

function reload() {
 gulp.series('desktop', electron.reload);
}
