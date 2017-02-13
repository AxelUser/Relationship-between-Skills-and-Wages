'use strict'

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

function lazyLoadTask(taskName, taskFilePath, options) {
    options = options || {}; 
    gulp.task(taskName, function (callback) {
        let task = require(taskFilePath).call(this, gulp, plugins, options)
        return task(callback);
    })   
}

lazyLoadTask('copyNpmDependencies', './gulp-tasks/copyNpmDependencies', {
    dest: './../docs/js'
});

lazyLoadTask('styles', './gulp-tasks/styles', {
    src: './src/less/**/*.less',
    dest: './../docs/styles'
});

lazyLoadTask('scripts', './gulp-tasks/scripts',{
    src: './src/js/**/*.js',
    dest: './../docs/js'
});

lazyLoadTask('views', './gulp-tasks/views',{
    src: './src/views/**/*.html',
    dest: './../docs'
});

gulp.task('build', gulp.parallel('copyNpmDependencies', 'styles', 'scripts', 'views'));