import {
  createSlice,
} from '@reduxjs/toolkit';

export const whiteboardSlice = createSlice(
  {
    initialState: {
      value: {
        collaborators: [],
        shape: '',
        title: '',
      },
    },
    name: 'whiteboard',
    reducers: {
      addCollaborator: (state, action) => {
        if (state.value.collaborators.find(collaborator => action.payload.firstName === collaborator.firstName && action.payload.lastName)) {
          return;
        }
        state.value.collaborators.push(action.payload);
      },
      editTitle: (state, action) => {
        state.value.title = action.payload;
      },
      removeCollaborator: (state, action) => {
        const index = state.value.collaborators.indexOf(action.payload);
        state.value.collaborators = state.value.collaborators.splice(index, index);
      },
      setShape: (state, action) => {
        state.value.shape = action.payload;
      },
    },
  },
);
export const {
  addCollaborator,
  removeCollaborator,
  editTitle,
  setShape,
} = whiteboardSlice.actions;

export default whiteboardSlice.reducer;
