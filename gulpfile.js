var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    nodemon = require('gulp-nodemon'),
    webpackStream = require('webpack-stream'),
    webpack = require('webpack');

const paths = {
  src: [
    'src/server/**/*.js',
    'src/assets/scss/**/*.scss'
  ]
};

gulp.task('css', function () {
  console.log('Generating css');
  return gulp.src('src/assets/scss/checkin.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer('last 4 version'))
  .pipe(gulp.dest('src/assets/public/css'))
  .pipe(cssnano())
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('src/assets/public/css'))
  .on('end', function() {
    browserSync.reload();
  });
});

gulp.task('nodemon', ['css'], function(cb) {
  return nodemon({
    exec: 'node --inspect=9229',
    script: 'src/server/index.js',
    ext: 'js html',
    watch: paths.src,
    env: {
      'NODE_ENV': 'development',
      'PORT': 3000
    }
  })
  .once('start', function() {
    cb();
  })
  .on('restart', function() {
    gulp.start('css');
  });
});

gulp.task('webpack', function() {
  gulp.src('src/assets/js/main.js')
    .pipe(webpackStream(require('./webpack.config.js'), webpack))
    .pipe(gulp.dest('src/assets/public/js'));
});

gulp.task('browser-sync', ['nodemon'], function() {
  browserSync.init(null, {
    port: 8000,
    proxy: {
      target: 'localhost:3000'
    }
  });
});
gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['css', 'browser-sync'], function () {
  gulp.watch("src/assets/scss/**/*.scss", ['css']);
});
