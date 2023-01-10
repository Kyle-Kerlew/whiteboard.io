import {UserController} from "../../handlers/rest/userController";
import {finishLoadingUser, loginUser, logoutUser} from "../../reducers/userReducer";

export function Authentication(dispatch) {
    return async function setAuthentication() {
        try {
            const {user} = await UserController.getUserDetailsByCookie();
            dispatch(loginUser(user.role));
        } catch (e) {
            dispatch(logoutUser());
        }
        dispatch(finishLoadingUser());
    }
}
