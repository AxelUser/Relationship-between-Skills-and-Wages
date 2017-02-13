'use strict'

module.exports = function (gulp, plugins, options) {
    return function () {
        let stream = gulp.src(options.src)
            .pipe(plugins.babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(options.dest));
        return stream;
    }
}