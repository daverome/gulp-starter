var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var swig        = require('gulp-swig');
var imagemin    = require('gulp-imagemin');
var rename      = require('gulp-rename');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var reload      = browserSync.reload;

var files = {
  sass: {
    src: '_src/sass/**/*.scss',
    dest: 'dist/assets/css'
  },
  html: {
    src: '_src/html/*.html',
    dest: 'dist/'
  },
  js: {
    src: ['_src/js/vendor/*.js', '_src/js/*.js'],
    dest: 'dist/assets/js'
  },
  images: {
    src: '_src/images/**/*.{png, jpg, gif}',
    dest: 'dist/assets/img'
  },
  font: {
    src: '_src/svg/*.svg',
    dest: 'dist/assets/fonts'
  }
};

//***************************************************************************
// Watch task
//***************************************************************************
gulp.task('serve', ['sass'], function() {
  'use strict';

  browserSync({
    server: './dist'
  });

  gulp.watch( files.sass.src, ['sass'] );
  gulp.watch( files.js.src, ['javascript'] );
  gulp.watch( files.images.src, ['imagemin'] );
  gulp.watch( files.html.src, ['templates'] );
  gulp.watch( files.font.src, ['iconfont'] );
});

//***************************************************************************
// HTML task
//***************************************************************************
gulp.task('templates', function() {
  'use strict';

  return gulp.src(files.html.src)
      .pipe(swig())
      .pipe(gulp.dest(files.html.dest))
      .on('end', reload);
});

//***************************************************************************
// SASS task
//***************************************************************************
gulp.task('sass', function() {
  'use strict';

  return gulp.src(files.sass.src)
      .pipe(sass().on('error', sass.logError)) // uncompressed version of the css file
      .pipe(gulp.dest(files.sass.dest))
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) // compressed version of the css file
      .pipe(rename(function (path) {path.extname = '.min.css';}))
      .pipe(gulp.dest(files.sass.dest))
      .pipe(reload({stream: true}));
});

//***************************************************************************
// Javascript task
//***************************************************************************
gulp.task('javascript', function() {
  'use strict';

  return gulp.src(files.js.src)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(files.js.dest))
    .pipe(uglify())
    .pipe(rename(function (path) {path.extname = '.min.js';}))
    .pipe(gulp.dest(files.js.dest))
    .pipe(reload({stream: true}));
});

//***************************************************************************
// Imagemin task
//***************************************************************************
gulp.task('imagemin', function() {
  'use strict';

  return gulp.src(files.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(files.images.dest));
});


gulp.task('default', ['serve']);
