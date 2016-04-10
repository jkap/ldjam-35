'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rollupify = require('rollupify');
const babelify = require('babelify');
const watchify = require('watchify');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// set up the browserify instance on a task basis
const obj = Object.assign({}, watchify.args, {
  entries: './src/index.js',
  debug: true,
  // defining transforms here will avoid crashing your stream
  transform: [
    rollupify,
    babelify
  ]
});

const b = watchify(browserify(obj));

function bundle() {
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
}

gulp.task('js', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

gulp.task('copy-html', () => {
  gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('serve', ['copy-html', 'js'], () => {
  browserSync({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.watch(['js/app.js'], { cwd: 'dist' }, reload);
gulp.watch(['**/*.html'], { cwd: 'src' }, ['copy-html']);
