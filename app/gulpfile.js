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

lazyLoadTask('copyToDocs', './gulp-tasks/copyFiles', {
    src: './public/**/*',
    dest: './../docs'
});

lazyLoadTask('copyNpmDependencies', './gulp-tasks/copyNpmDependencies', {
    dest: './public/scripts/lib'
});

lazyLoadTask('styles', './gulp-tasks/styles', {
    src: './src/less/**/*.less',
    dest: './public/styles'
});

lazyLoadTask('scripts', './gulp-tasks/scripts',{
    src: './src/js/**/*.js',
    dest: './public/scripts'
});

lazyLoadTask('views', './gulp-tasks/views',{
    src: './src/views/**/*.html',
    dest: './public'
});

gulp.task('build', gulp.parallel('copyNpmDependencies', 'styles', 'scripts', 'views'));
gulp.task('publish', gulp.series('build', 'copyToDocs'));