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
                state.value.collaborators = state.value.collaborators.concat(action.payload);
            },
            removeCollaborator: (state, action) => {
                const index = state.value.collaborators.indexOf(action.payload);
                state.value.collaborators = state.value.collaborators.splice(index, index);
            },
            editTitle: (state, action) => {
                state.value.title = action.payload;
            }
        }
    });
export const {addCollaborator, removeCollaborator, editTitle} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;