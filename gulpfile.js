/* Gulpfile */

var p = require('./package.json')

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    rename = require("gulp-rename"),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    insert = require('gulp-insert'),
    plumber = require('gulp-plumber');

var sources = {
    sass: ['./src/scss/*.scss'],
    html: ['./src/**/*.html'],
    js: ['./src/**/*.js'],
    bower_js: [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/jquery/dist/jquery.min.map',
        './bower_components/modernizr/modernizr.js'
    ]
};

gulp.task('sass', function(){
    return gulp.src(sources.sass)
        .pipe(plumber())
        .pipe(sass({style: 'expanded'}))
        .pipe(gulp.dest('./src/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('./src/css'))
        .pipe(connect.reload());
});

gulp.task('js', function(){
    gulp.src( sources.js )
        .pipe(plumber())
        .pipe(connect.reload());
});

gulp.task('html', function(){
    gulp.src( sources.html )
        .pipe(plumber())
        .pipe(connect.reload());
});

gulp.task('copy', function() {
    gulp.src(sources.bower_js)
        .pipe(plumber())
        .pipe(gulp.dest('./src/js'));
});

gulp.task('connect', function(){
    connect.server({
        livereload: true,
        port:8181
    });
});

gulp.task('concatcompress', function() {

    var license = '/**\n  ' +
                  '* frmlnd-current\n  ' +
                  '* A super lightweight currency conversion tool.\n  ' +
                  '* @version ' + p.version + '\n  ' + 
                  '* @author Adam Penly <apenly@gmail.com>\n  ' + 
                  '* @link https://github.com/frmlnd/frmlnd-current\n  ' +
                  '* @license MIT License, http://www.opensource.org/licenses/MIT\n  */\n\n';

    gulp.src(['./src/js/frmlnd-current.js'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(rename('frmlnd-current.min.js'))
        .pipe(sourcemaps.write())
        .pipe(uglify())
        .pipe(insert.prepend(license))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('watch', function(){
    gulp.watch(sources.sass, ['sass']);
    gulp.watch(sources.html, ['html']);
    gulp.watch(sources.js, ['js']);
    gulp.watch(sources.js, ['js','concatcompress']);
});

gulp.task('dist', function() {
    gulp.src(sources.bower_js)
        .pipe(plumber())
        .pipe(gulp.dest('./dist/js'));
    gulp.src(sources.bower_js)
        .pipe(plumber())
        .pipe(gulp.dest('./dist/js'));
    gulp.src(['./src/js/**/frmlnd-*.*'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/js'));
    gulp.src(['./src/css/**/*.*'])
        .pipe(plumber())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task( 'default', ['connect', 'copy', 'sass', 'watch'] );
gulp.task( 'build', ['copy', 'sass', 'concatcompress', 'dist']  );
