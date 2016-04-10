import gulp from 'gulp';
import browserSync from 'browser-sync';

const paths = {
  src: './src'
};

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: paths.src
    }
  });
});

gulp.task('default', ['browserSync']);
