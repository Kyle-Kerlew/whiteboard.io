const bcrypt = require('bcrypt');
const atob = require('atob');

const saltRounds = 10;

function hashPassword(base64Password) {
    return bcrypt.hash(atob(base64Password), saltRounds);
}

function doesPasswordMatch(base64Password, hash) {
    return bcrypt.compare(atob(base64Password), hash);
}

module.exports = {hashPassword, doesPasswordMatch}
