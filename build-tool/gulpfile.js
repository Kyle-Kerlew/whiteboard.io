const {series, parallel} = require('gulp');

function build(cb) {
    cb();
}

function clean(cb) {
    cb();
}

function zip(cb) {
    cb();
}

exports.build = series(clean, build, zip);