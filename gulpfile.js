// Gulp
const gulp = require('gulp');
const watch = require('gulp-watch');
const wait = require('gulp-wait');
const plumber = require('gulp-plumber');

// SASS/CSS
const concat = require('gulp-concat');
const cleancss = require('gulp-clean-css');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// Images
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');

// Javascript/ES6
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// LiveReload
const browserSync = require('browser-sync').create();

// Jekyll
const child = require('child_process');
const gutil = require('gulp-util');

// Important folder paths
const PATHS = {
  'docs': './docs',
  'src': {
    'self': './src/',
    'sass': './src/sass',
    'js': './src/js',
    'images': './src/images'
  },
  'dist': {
    'css': `./docs/dist/css`,
    'js': `./docs/dist/js`,
    'img': './docs/dist/img'
  }
}

// Compile sass, autoprefix it and concat the files into one bundle
gulp.task('sass:build', () => {
  return gulp.src(`${PATHS.src.sass}/main.sass`)
    .pipe(wait(500)) // Fixes file not found error on vscode
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(`${PATHS.dist.css}`));
});

// Build jekyll template into docs
gulp.task('jekyll:build', () => {
  // Adding incremental reduces build time.
  child.spawn('jekyll.bat', ['build'], {
    stdio: 'inherit'
  }).on('error', (error) => gutil.log(gutil.colors.red(error.message)))
});

// Concat 
gulp.task('js:build', () => {
  return gulp.src(`${PATHS.src.js}/**/*.js`)
    .pipe(plumber())
    .pipe(concat('bundle.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest(`${PATHS.dist.js}`))
});

// Use browser-sync to serve files over static server
gulp.task('browserSync:serve', () => {
  // Browser-sync properties
  browserSync.init({
    'notify': false,
    'server': {
      'baseDir': './docs'
    }
  });
});

// Production optimization
gulp.task('css:minify', ['sass:build'], () => {
  return gulp.src(`${PATHS.dist.css}/bundle.css`)
    .pipe(cleancss())
    .pipe(gulp.dest(`${PATHS.dist.css}`));
});

gulp.task('js:minify', ['js:build'], () => {
  return gulp.src(`${PATHS.dist.js}/bundle.js`)
    .pipe(uglify())
    .pipe(gulp.dest(`${PATHS.dist.js}`))
});

gulp.task('images:optimize', () => {
  return gulp.src(`${PATHS.src.images}/*`)
    .pipe(imagemin({
      progressive: true,
      use: [pngquant()]
    }))
    .pipe(gulp.dest(`${PATHS.dist.img}`));
});

// Master task that bundles every other development task
gulp.task('dev', ['sass:build', 'js:build', 'jekyll:build', 'browserSync:serve'], () => {
  gulp.watch(`${PATHS.src.sass}/**/*.sass`, ['sass:build']);
  gulp.watch(`${PATHS.src.js}/**/*.js`, ['js:build']);
  gulp.watch(`${PATHS.src.self}/**/*.{html,yaml,yml,json,markdown,md}`, ['jekyll:build']);
  gulp.watch(`${PATHS.docs}/**/*`).on('change', browserSync.reload);
});

// Master task that bundles every other production task
gulp.task('prod', ['css:minify', 'js:minify', 'jekyll:build', 'images:optimize']);