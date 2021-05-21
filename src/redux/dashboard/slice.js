import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adherents: null,
    jemengage_users: null,
    jemengage_downloads: null,
    jemengage_downloads_ratio: null,
    jemengage_survey: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        updateAdherents(state, action) {
            state.adherents = action.payload;
        },
        updateUsers(state, action) {
            state.jemengage_users = action.payload;
        },
    },
});

export const { updateAdherents, updateUsers } = dashboardSlice.actions;
export default dashboardSlice.reducer;
