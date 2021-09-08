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
        resetAdherentsState() {
            return initialState;
        },
    },
});

export const {
    updateColumnsTitle,
    resetAdherentsState,
} = adherentsSlice.actions;

export default adherentsSlice.reducer;
