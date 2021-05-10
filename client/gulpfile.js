const {src, dest, series} = require('gulp');
const del = require('del');
const fs = require('fs');
const zip = require('gulp-zip');
const log = require('fancy-log');
let exec = require('child_process').exec;

const paths = {
    prod_build: '../prod-build',
    react_src: '/build/**/*',
    react_dist: '../prod-build/my-app/build',
    zipped_file_name: 'react-nodejs.zip'
};

function clean() {
    log('removing the old files in the directory')
    return del('../prod-build/**', {force: true});
}

function createProdBuildFolder() {

    const dir = paths.prod_build;
    log(`Creating the folder if not exist  ${dir}`)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        log('📁  folder created:', dir);
    }

    return Promise.resolve('the value is ignored');
}

function buildReactCodeTask(cb) {
    log('building React code into the directory')
    return exec('npm run build', function (err, stdout, stderr) {
        log(stdout);
        log(stderr);
        cb(err);
    })
}

function zippingTask() {
    log('zipping the code ')
    return src(`${paths.prod_build}/**`)
        .pipe(zip(`${paths.zipped_file_name}`))
        .pipe(dest(`${paths.prod_build}`))
}

exports.default = series(
    clean,
    createProdBuildFolder,
    buildReactCodeTask,
    zippingTask
);