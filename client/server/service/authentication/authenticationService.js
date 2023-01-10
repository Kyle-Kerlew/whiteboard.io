import {doesPasswordMatch} from "../../utils/hash";
import {getUserByEmail} from "../user/userService";


async function verifyPassword(user) {
    const userEntity = await getUserByEmail(user.email);
    if (!userEntity) {
        return null;
    }
    const validCredentials = await doesPasswordMatch(user.password, userEntity.password);
    if (!validCredentials) {
        return null;
    }
    return userEntity;
}


export default {
    authenticationService: {
        verifyPassword
    }
};
