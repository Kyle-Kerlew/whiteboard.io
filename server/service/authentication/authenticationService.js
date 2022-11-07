const {doesPasswordMatch} = require("../../utils/hash");
const {userService} = require('../../service/user/userService');

async function verifyPassword(user) {
    const userEntity = await userService.findUserByEmail(user.email);
    if (!userEntity) {
        return null;
    }
    const validCredentials = await doesPasswordMatch(user.password, userEntity.password);
    console.log("Valid credentials?", validCredentials);
    if (!validCredentials) {
        return null;
    }
    return userEntity;
}


module.exports = {
    authenticationService: {
        verifyPassword
    }
};
