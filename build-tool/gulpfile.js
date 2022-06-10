const {series, parallel} = require('gulp');
const {exec} = require('child_process');
const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

function buildClient(cb) {
    exec("cd ../client && npm i && npm run-script build", (error, stdout, stderr) => {
        if (error) {
            console.log(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            cb();
            return;
        }
        cb();
        console.log(`stdout: ${stdout}`);
    });

}

function cleanClientBuild(cb) {
    fs.rm(path.join(__dirname, '../client', 'build'), {recursive: true, force: true}, err => {
        if (err) {
            console.log("build folder does not exist", err);
            cb();
            return;
        }
        console.log("Build folder deleted");
        cb();
    })
}

function cleanClientZip(cb) {
    fs.rm(path.join(__dirname, '../', 'client.zipClient'), {recursive: true, force: true}, (err) => {
        if (err) {
            console.log("Zip file does not exist", err);
            cb();
            return;
        }
        cb();
        console.log("Previous zip deleted");
    })
}

function zipClient(cb) {
    const clientFolder = path.join(__dirname, '..', 'client');

    const zip = new AdmZip();
    zip.addLocalFolder(path.join(clientFolder, '/build'), '/build');
    zip.addLocalFile(path.join(clientFolder, 'package.json'));
    zip.addLocalFile(path.join(clientFolder, 'server.js'));
    zip.writeZip(path.join(__dirname, '..', 'client.zip'), (err) => {
        if (err) {
            throw err;
        }
        cb();

    });
}

function zipServer(cb) {
    const serverFolder = path.join(__dirname, '..', 'server');

    const zip = new AdmZip();
    zip.addLocalFolder(path.join(serverFolder, './persistence'), '/persistence');
    zip.addLocalFile(path.join(serverFolder, 'package.json'));
    zip.addLocalFile(path.join(serverFolder, 'app.js'));
    zip.writeZip(path.join(__dirname, '..', 'server.zip'), (err) => {
        if (err) {
            throw err;
        }
        cb();

    });
}

function buildServer(cb) {
    //todo: minify code
    //todo: babel transpile code
    //todo: zipClient files for deployment
    cb();
}

exports.default = parallel(series(parallel(cleanClientBuild, cleanClientZip), buildClient, zipClient), series(buildServer, zipServer));
