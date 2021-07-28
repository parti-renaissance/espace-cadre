import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'contacts',
    initialState: null,
    reducers: {
        updateContacts(state, action) {
            return action.payload;
        },
        resetContactsState() {
            return null;
        },
    },
});

export const { updateContacts, resetContactsState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
