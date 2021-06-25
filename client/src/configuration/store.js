import {configureStore} from '@reduxjs/toolkit';
import collaboratorsReducer from "../reducers/collaboratorsReducer";
import userReducer from "../reducers/userReducer";

export default configureStore({
    reducer: {
        collaborators: collaboratorsReducer,
        user: userReducer
    }
});