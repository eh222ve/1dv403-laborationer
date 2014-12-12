var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    //concat = require('gulp-concat'),
    concat = require('gulp-concat-util'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');


gulp.task('Concat lib', function() {
    gulp.src(['js/lib/*.js', 'js/lib/**/*.js', 'js/main.js'])
        .pipe(concat('script.min.js'))
        .pipe(concat.header('\"use strict\";\n'))
        .pipe(uglify())
        .pipe(gulp.dest('js/'));
    gulp.src(['js/lib/*.js', 'js/lib/**/*.js', 'js/main.js'])
        .pipe(concat('script.js'))
        .pipe(gulp.dest('js/'));
});
