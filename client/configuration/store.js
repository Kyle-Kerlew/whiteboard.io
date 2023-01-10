import {
  configureStore,
} from '@reduxjs/toolkit';
import userReducer from './../reducers/userReducer';
import whiteboardReducer from './../reducers/whiteboardReducer';
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
configureStore({
  reducer: {
    user: userReducer,
    whiteboard: whiteboardReducer,
  },
});
export const wrapper = createWrapper(makeStore);

