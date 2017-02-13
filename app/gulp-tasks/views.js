'use strict'

module.exports = function (gulp, plugins, options) {
    return function (callback) {
        let stream = gulp.src(options.src)
            .pipe(gulp.dest(options.dest));
        return stream;
    }
}