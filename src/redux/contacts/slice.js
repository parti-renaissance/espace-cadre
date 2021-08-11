import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    columnsTitle: null,
    contacts: null,
};

const dashboardSlice = createSlice({
    name: 'contacts',
    initialState,
    reducers: {
        updateColumnsTitle(state, action) {
            state.columnsTitle = action.payload;
        },
        updateContacts(state, action) {
            state.contacts = action.payload;
        },
        resetContactsState() {
            return initialState;
        },
    },
});

export const { updateColumnsTitle, updateContacts, resetContactsState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
