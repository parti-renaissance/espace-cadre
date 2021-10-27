import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messageSubject: null,
    messageTemplate: null,
    selectedTemplate: null,
    remoteMessage: null,
};

const messageSlice = createSlice({
    name: 'messagerie',
    initialState,
    reducers: {
        updateMessageTemplate(state, action) {
            state.messageTemplate = action.payload;
        },
        updateMessageSubject(state, action) {
            state.messageSubject = action.payload;
        },
        updateSelectedTemplate(state, action) {
            state.selectedTemplate = action.payload;
        },
        resetMessagerieState() {
            return initialState;
        },
    },
});

export const {
    updateMessageTemplate,
    updateMessageSubject,
    resetMessagerieState,
    updateSelectedTemplate,
} = messageSlice.actions;
export default messageSlice.reducer;
