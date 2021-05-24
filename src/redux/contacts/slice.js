import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
    name: 'contacts',
    initialState: null,
    reducers: {
        updateContacts(state, action) {
            return action.payload;
        },
    },
});

export const { updateContacts } = dashboardSlice.actions;
export default dashboardSlice.reducer;
