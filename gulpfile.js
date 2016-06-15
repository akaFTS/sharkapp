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
var git = require('gulp-git');

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
        .pipe(inject(gulp.src(["./www/css/*.css", "!./www/css/ionic.app.min.css", "./www/js/*.js"], 
          {read: false}), {relative: true}))
        .pipe(gulp.dest('./www'));
});

//alias pra chamar ambos os injects
gulp.task('index', ['wiredep', 'inject']);

//comando para git add .
gulp.task('git-add', function(){
  return gulp.src('./')
    .pipe(git.add());
});

//comando para git commit, recebe msg na command-line
gulp.task('git-commit', ['git-add'], function(){
  var argv = require('yargs').default({ m : "Pequenos ajustes." }).argv;
  var msg = argv.m;
  return gulp.src('./')
    .pipe(git.commit(msg));
});

//comando para git-push
gulp.task('git-push', ['git-commit'], function(){
  git.push('origin', 'master', function (err) {
    if (err) throw err;
  });
});

//sobe pro servidor do ionic
gulp.task('ionic-upload', function(){
  var deferred = q.defer();
  sh.exec("ionic upload", {}, function(code, stdout){
    gutil.log(gutil.colors.magenta("ionic-upload"), stdout);
    deferred.resolve();
  });

  return deferred.promise;
});

//sobe no git e no ionic
gulp.task('sync', ['git-push', 'ionic-upload'], function(){

});
