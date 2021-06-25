import {createSlice} from '@reduxjs/toolkit';

export const collaboratorsSlice = createSlice(
    {
        name: 'collaborators',
        initialState: {
            value: []
        },
        reducers: {
            addCollaborator: (state, action) => {
                console.log("Adding collaborator", action.payload);
                state.value = state.value.concat(action.payload);
                console.log("Value after modifying", state.value)
            },
            removeCollaborator: (state, action) => {
                const index = state.value.indexOf(action.payload);
                state.value = state.value.splice(index, index);
            }
        }
    });
export const {addCollaborator, removeCollaborator} = collaboratorsSlice.actions;

export default collaboratorsSlice.reducer;