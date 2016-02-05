var gulp              = require('gulp'),
    sass              = require('gulp-sass'),
    uglify            = require('gulp-uglify'),
    autoprefixer      = require('gulp-autoprefixer'),
    imagemin          = require('gulp-imagemin'),
    cache             = require('gulp-cache'),
    express           = require('express'),
    lr;

var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

function notifyLR(event) {
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
  lr.changed({
    body: { files: [fileName] }
  });
}

gulp.task('startExpress', function() {
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
});

gulp.task('startLR', function() {
  lr = require('tiny-lr')();
  lr.listen(LIVERELOAD_PORT);
});

gulp.task('styles', function() {
    gulp.src('assets/sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/css'))
});

gulp.task('scripts', function() {
    gulp.src('assets/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function() {
    gulp.src('assets/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('dist/img'))
});


gulp.task('default', function() {
    gulp.start(
      'styles',
      'scripts',
      'images',
      'startExpress',
      'startLR',
      'watch'
    );
});

gulp.task('watch', function() {

  gulp.watch('assets/sass/**/*.scss', ['styles']);
  gulp.watch('assets/js/**/*.js', ['scripts']);
  gulp.watch('assets/img/**/*', ['images']);
  gulp.watch('dist/js/**/*.js', notifyLR);
  gulp.watch('dist/css/**/*.css', notifyLR);
  gulp.watch('**/*.html', notifyLR);

});
