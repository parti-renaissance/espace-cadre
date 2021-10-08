import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messageSubject: null,
    messageTemplate: null,
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
        updateRemoteMessage(state, action) {
            state.remoteMessage = action.payload;
        },
        resetMessagerieState() {
            return initialState;
        },
    },
});

export const {
    updateMessageTemplate,
    updateMessageSubject,
    updateRemoteMessage,
    resetMessagerieState,
} = messageSlice.actions;
export default messageSlice.reducer;
