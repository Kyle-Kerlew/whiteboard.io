import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice(
    {
        name: 'user',
        initialState: {
            value: {
                isLoadingUser: true,
                isAuthenticated: false,
                role: '',
            }
        },
        reducers: {
            loginUser: (state, action) => {
                state.value.isAuthenticated = action.payload !== 'guest';
                state.value.role = action.payload;
            },
            logoutUser: state => {
                state.value.isAuthenticated = false;
                state.value.role = '';
            },
            finishLoadingUser: state => {
                state.value.isLoadingUser = false;
            }
        }
    });
export const {loginUser, logoutUser, finishLoadingUser} = userSlice.actions;

export default userSlice.reducer;