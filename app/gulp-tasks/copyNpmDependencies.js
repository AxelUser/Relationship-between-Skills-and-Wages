'use strict'

const paths = [
    './node_modules/synaptic/dist/synaptic.js',
    './node_modules/requirejs/require.js',
    './data/nn_manifest.json',
    './data/nn_model.json'
];

module.exports = function (gulp, plugins, options) {
    return function (callback) {
        let stream = gulp.src(paths)
            .pipe(gulp.dest(options.dest));
        return stream;
    }
}