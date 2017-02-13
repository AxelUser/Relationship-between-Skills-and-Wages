'use strict'

const paths = [
    './node_modules/synaptic/dist/synaptic.js'
];

module.exports = function (gulp, plugins, options) {
    return function (callback) {
        let stream = gulp.src(paths)
            .pipe(gulp.dest(options.dest));
        return stream;
    }
}