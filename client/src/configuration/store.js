import {
  configureStore,
} from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
import whiteboardReducer from '../reducers/whiteboardReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    whiteboard: whiteboardReducer,
  },
});
