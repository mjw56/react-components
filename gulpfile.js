'use strict';

var gulp = require('gulp'),
    changed = require('gulp-changed'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reactify = require('reactify'),
    del = require('del'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync'),
    concatCss = require('gulp-concat-css'),
    reload = browserSync.reload,
    p = {
      jsx: ['./lib/scripts/app.jsx'],
      css: ['lib/styles/main.css', 'lib/styles/bootstrap.min.css'],
      bundle: 'app.js',
      distJs: 'dist/js',
      distCss: 'dist/css'
    };

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './'
    }
  })
});

gulp.task('watchify', function() {
  var bundler = watchify(browserify(p.jsx, watchify.args));

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(p.bundle))
      .pipe(gulp.dest(p.distJs))
      .pipe(reload({stream: true}));
  }

  bundler.transform(reactify)
  .on('update', rebundle);
  return rebundle();
});

gulp.task('browserify', function() {
  browserify(p.jsx)
    .transform(reactify)
    .bundle()
    .pipe(source(p.bundle))
    .pipe(buffer())
    .pipe(gulp.dest(p.distJs));
});

gulp.task('styles', function() {
  return gulp.src(p.css)
    .pipe(changed(p.distCss))
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest(p.distCss))
    .pipe(reload({stream: true}));
});

gulp.task('watchTask', function() {
  gulp.watch(p.css, ['styles']);
});

gulp.task('watch', ['clean'], function() {
  gulp.start(['browserSync', 'watchTask', 'watchify', 'styles']);
});

gulp.task('build', ['clean'], function() {
  process.env.NODE_ENV = 'production';
  gulp.start(['browserify', 'styles']);
});

gulp.task('default', ['build', 'watch']);
