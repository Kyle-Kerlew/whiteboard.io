import {
  createSlice,
} from '@reduxjs/toolkit';

export const userSlice = createSlice(
  {
    initialState: {
      value: {
        isAuthenticated: false,
        isLoadingUser: true,
        role: '',
      },
    },
    name: 'user',
    reducers: {
      finishLoadingUser: (state) => {
        state.value.isLoadingUser = false;
      },
      loginUser: (state, action) => {
        state.value.isAuthenticated = action.payload !== 'guest';
        state.value.role = action.payload;
      },
      logoutUser: (state) => {
        state.value.isAuthenticated = false;
        state.value.role = '';
      },
    },
  },
);
export const {
  loginUser,
  logoutUser,
  finishLoadingUser,
} = userSlice.actions;

export default userSlice.reducer;
