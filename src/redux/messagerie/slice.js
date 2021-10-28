import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedTemplate: null,
};

const messageSlice = createSlice({
    name: 'messagerie',
    initialState,
    reducers: {
        updateSelectedTemplate(state, action) {
            state.selectedTemplate = action.payload;
        },
        resetMessagerieState() {
            return initialState;
        },
    },
});

export const {
    resetMessagerieState,
    updateSelectedTemplate,
} = messageSlice.actions;
export default messageSlice.reducer;
