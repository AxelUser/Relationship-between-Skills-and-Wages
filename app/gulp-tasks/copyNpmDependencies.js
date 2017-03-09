'use strict'

const paths = [
    './node_modules/synaptic/dist/synaptic.js',
    './node_modules/vue/dist/vue.min.js',
    './node_modules/requirejs/require.js',
    './data/model/nn_manifest.json',
    './data/model/nn_model.json'
];

module.exports = function (gulp, plugins, options) {
    return function (callback) {
        let stream = gulp.src(paths)
            .pipe(gulp.dest(options.dest));
        return stream;
    }
}