import bcrypt from "bcrypt";
import atob from "atob";

const saltRounds = 10;

export function hashPassword(base64Password) {
    return bcrypt.hash(atob(base64Password), saltRounds);
}

export function doesPasswordMatch(base64Password, hash) {
    return bcrypt.compare(atob(base64Password), hash);
}
