import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice(
    {
        name: 'user',
        initialState: {
            value: {
                isAuthenticated: false,
            }
        },
        reducers: {
            loginUser: state => {
                state.value.isAuthenticated = true;
            },
            logoutUser: state => {
                state.value.isAuthenticated = false;
            }
        }
    });
export const {loginUser, logoutUser} = userSlice.actions;

export default userSlice.reducer;