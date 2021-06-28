import {createSlice} from '@reduxjs/toolkit';

export const whiteboardSlice = createSlice(
    {
        name: 'whiteboard',
        initialState: {
            value: {
                title: '',
                collaborators: []
            }
        },
        reducers: {
            addCollaborator: (state, action) => {
                state.value = state.value.concat(action.payload);
            },
            removeCollaborator: (state, action) => {
                const index = state.value.indexOf(action.payload);
                state.value = state.value.splice(index, index);
            },
            editTitle: (state, action) => {
                state.value.title = action.payload;
            }
        }
    });
export const {addCollaborator, removeCollaborator, editTitle} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;