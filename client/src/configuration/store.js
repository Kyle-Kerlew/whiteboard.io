import {configureStore} from '@reduxjs/toolkit';
import whiteboardReducer from "../reducers/whiteboardReducer";
import userReducer from "../reducers/userReducer";

export default configureStore({
    reducer: {
        whiteboard: whiteboardReducer,
        user: userReducer
    }
});