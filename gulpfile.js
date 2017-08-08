const gulp = require('gulp');
const gulpNotify = require('gulp-notify');
const gulpPlumber = require('gulp-plumber');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpTypescript = require('gulp-typescript');
const runSequence = require('run-sequence');

// task names
const tsTranspileTask = ':ts:transpile';
const watchTask = ':watch';
const developTask = 'develop';

// local constants
const tsDestDir = 'src';


gulp.task(tsTranspileTask, () => {
  const tsOptions = { typescript: require('typescript') };
const tsProject = gulpTypescript.createProject('tsconfig.json', tsOptions);

return tsProject.src()
  .pipe(gulpPlumber({
    errorHandler: gulpNotify.onError({
      title: 'TS Error',
      message: '<%= error.message %>',
      onLast: true,
      timeout: 1,
    })
  }))
  .pipe(gulpSourcemaps.init())
  .pipe(tsProject(gulpTypescript.reporter.defaultReporter()))
  .js
  .pipe(gulpSourcemaps.write())
  .pipe(gulp.dest(tsDestDir))
  .pipe(gulpNotify({
    title: 'TypeScript',
    message: 'Finish transpiling',
    onLast: true,
    timeout: 1,
  }));
});

gulp.task(watchTask, (done) => {
  gulp.watch('src/**/*.ts', [tsTranspileTask]);
done();
});

gulp.task(developTask, () => {
  runSequence(
    tsTranspileTask,
    watchTask
  );
});
