import {createContext} from "react";

const UserContext = createContext({
    user: {isAuthenticated: false}
})
export default UserContext;