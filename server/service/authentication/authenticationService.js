const {doesPasswordMatch} = require("../../utils/hash");
const {userService} = require('../../service/user/userService');

async function verifyPassword(user) {
    const userEntity = await userService.findUserByEmail(user.email);
    if (!userEntity) {
        return {error: "Invalid credentials."}
    }
    const validCredentials = await doesPasswordMatch(user.password, userEntity.password);
    if (!validCredentials) {
        return {error: "Invalid credentials."}
    }
    return userEntity;
}


module.exports = {
    authenticationService: {
        verifyPassword
    }
};