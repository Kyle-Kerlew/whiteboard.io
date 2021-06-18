const {doesPasswordMatch} = require("../../utils/hash");
const {userService} = require('../../service/user/userService');

async function verifyPassword(user) {
    const userEntity = await userService.findUserByEmail(user.email);
    if (!userEntity) {
        throw {error: "Invalid credentials."}
    }
    const validCredentials = await doesPasswordMatch(user.password, userEntity.password);
    if (!validCredentials) {
        throw {error: "Invalid credentials."}
    }
    const authenticatedUser = userEntity;
    return authenticatedUser;
}

module.exports = {
    authenticationService: {
        verifyPassword
    }
};