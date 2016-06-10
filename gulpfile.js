var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var wiredep = require('wiredep').stream;
var inject = require('gulp-inject');
var q = require("q");


var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

//injeta libs do bower no index.html
gulp.task('wiredep', function() {

    var wire = require('wiredep');
    q.fcall(wire, {src: 'www/index.html', exclude: ['angular.js']}).then(function(data){
      var files = data.js ? data.js.length : 0;
      files += data.css ? data.css.length : 0;
      gutil.log(gutil.colors.magenta('wiredep'), "wired", gutil.colors.cyan(files), "files.");  
    });

});

//injeta arquivos nossos no index.html
gulp.task('inject', function() {
    gulp.src("./www/index.html")
        .pipe(inject(gulp.src(["./www/css/*.css", "./www/js/*.js"], {read: false})))
        .pipe(gulp.dest('./www'));
});

//alias pra chamar ambos os injects
gulp.task('index', ['wiredep', 'inject']);
