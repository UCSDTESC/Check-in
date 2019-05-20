var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  nodemon = require('gulp-nodemon'),
  webpackStream = require('webpack-stream'),
  webpack = require('webpack'),
  gutil = require('gulp-util'),
  gulpif = require('gulp-if'),
  tslint = require('gulp-tslint');
let browserSync = gutil.env.production ?
  undefined : require('browser-sync').create();

const paths = {
  'api-docs': [
    'src/server/**/*.yaml',
  ],
  server: [
    'src/server/**/*.ts',
    'src/shared/**/*.ts',
  ],
  ts: [
    'src/client/**/*.ts',
    'src/shared/**/*.ts',
    'src/client/**/*.tsx'
  ]
};

gulp.task('css', function () {
  gutil.log('Generating css');
  let stream = gulp.src('src/assets/scss/checkin.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(gulp.dest('src/assets/public/css'))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulpif(!gutil.env.production, sourcemaps.write()))
    .pipe(gulp.dest('src/assets/public/css'));

  if (browserSync) {
    stream.pipe(browserSync.stream());
  }
  return stream;
});

gulp.task('tslint', function () {
  return gulp.src(paths.ts)
    .pipe(tslint({
      formatter: 'stylish'
    }))
    .pipe(tslint.report({
      allowWarnings: true
    }));
});

gulp.task('nodemon', ['css'], function (cb) {
  return nodemon({
    exec: './node_modules/.bin/ts-node -P ./src/server/tsconfig.json ' +
      '-r tsconfig-paths/register ./src/server/main.ts',
    ext: 'ts yaml',
    watch: [...paths.server, ...paths["api-docs"]],
    env: {
      'NODE_ENV': 'development',
      'TS_NODE_FILES': 'true',
      'PORT': 3000
    }
  })
    .once('start', function () {
      cb();
    })
    .on('restart', function () {
      gulp.start('css');
    });
});

gulp.task('webpack', ['tslint'], function () {
  gulp.src('src/client/main.tsx')
    .pipe(webpackStream(require('./webpack.config.prod.js'), webpack))
    .pipe(gulp.dest('src/assets/public/js'));
});

gulp.task('browser-sync', ['nodemon'], function () {
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

gulp.task('test', ['webpack']);

gulp.task('default', ['css', 'browser-sync'], function () {
  gulp.watch('src/assets/scss/**/*.scss', ['css']);
});

gulp.task('prod', ['webpack', 'css']);
