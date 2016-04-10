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

gulp.task('javascript', () => {
  // set up the browserify instance on a task basis
  const b = browserify({
    entries: './src/index.js',
    debug: true,
    // defining transforms here will avoid crashing your stream
    transform: [
      rollupify,
      babelify
    ]
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));
});
