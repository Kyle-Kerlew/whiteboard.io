const bcrypt = require('bcrypt');
const atob = require('atob');

const saltRounds = 10;

async function hashPassword(base64Password) {
    return await bcrypt.hash(atob(base64Password), saltRounds);
}

async function doesPasswordMatch(base64Password, hash) {
    return await bcrypt.compare(atob(base64Password), hash);
}

module.exports = {hashPassword, doesPasswordMatch}