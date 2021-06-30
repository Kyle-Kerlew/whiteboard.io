import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice(
    {
        name: 'user',
        initialState: {
            value: {
                isLoadingUser: true,
                isAuthenticated: false,
                email: ''
            }
        },
        reducers: {
            loginUser: (state, action) => {
                state.value.isAuthenticated = true;
                state.value.email = action.payload;
            },
            logoutUser: state => {
                state.value.isAuthenticated = false;
                state.value.email = '';
            },
            finishLoadingUser: state => {
                state.value.isLoadingUser = false;
            }
        }
    });
export const {loginUser, logoutUser, finishLoadingUser} = userSlice.actions;

export default userSlice.reducer;