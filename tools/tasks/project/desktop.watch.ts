import * as gulp from 'gulp';

const electron = require('electron-connect').server.create({ 'path': 'dist/dev' });

export = () => {
  electron.start();
  gulp.watch(['./src/**/*'], reload);
};

function reload() {
 gulp.series('desktop', electron.reload);
}
