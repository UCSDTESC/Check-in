var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  nodemon = require('gulp-nodemon'),
  webpackStream = require('webpack-stream'),
  webpack = require('webpack'),
  eslint = require('gulp-eslint'),
  plumber = require('gulp-plumber'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if');
let browserSync = gutil.env.production ?
  undefined : require('browser-sync').create();

const paths = {
  src: [
    'src/server/**/*.js',
    'src/assets/scss/**/*.scss'
  ],
  js: [
    'src/server/**/*.js',
    'src/assets/js/**/*.js'
  ]
};

// Handle Errors
function handleError(err) {
  gutil.log(err);
  this.emit('end');
  if (gutil.env.production) {
    process.exit(1);
  }
}

var plumberOptions = {
  errorHandler: handleError
};

gulp.task('css', function () {
  gutil.log('Generating css');
  let stream = gulp.src('src/assets/scss/checkin.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('src/assets/public/css'))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulpif(!gutil.env.production, sourcemaps.write()))
    .pipe(gulp.dest('src/assets/public/css'));

  if (browserSync) {
    stream.pipe(browserSync.stream());
  }
  return stream;
});

gulp.task('eslint', function() {
  return gulp.src(paths.js)
    .pipe(plumber(plumberOptions))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
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
    .pipe(webpackStream(require('./webpack.config.prod.js'), webpack))
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

gulp.task('test', ['eslint']);

gulp.task('default', ['css', 'browser-sync'], function () {
  gulp.watch('src/assets/scss/**/*.scss', ['css']);
});

gulp.task('prod', ['webpack', 'css', 'eslint']);
