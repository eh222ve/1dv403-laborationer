var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat-util');


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
