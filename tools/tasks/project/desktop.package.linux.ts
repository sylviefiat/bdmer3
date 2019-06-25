import * as gulp from 'gulp';
var symdest = require('gulp-symdest');
var electron = require('gulp-atom-electron');

export default () => {
  let src = [
    'dist/dev/**/*'
  ];
  return gulp.src(src, { base: 'dist/dev' })
    .pipe(electron({ version: '0.37.2', platform: 'linux' }))
    .pipe(symdest('desktop/linux'));
};
