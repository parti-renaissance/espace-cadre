import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    columnsTitle: [],
};

const adherentsSlice = createSlice({
    name: 'adherents',
    initialState,
    reducers: {
        updateColumnsTitle(state, action) {
            state.columnsTitle = action.payload;
        },
        resetContactsState() {
            return initialState;
        },
    },
});

export const {
    updateColumnsTitle,
    resetContactsState,
} = adherentsSlice.actions;

export default adherentsSlice.reducer;
