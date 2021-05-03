import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    content: null,
};

const templateSlice = createSlice({
    name: 'template',
    initialState,
    reducers: {
        updateTemplate(state, action) {
            state.content = action.payload;
        },
    },
});

export const { updateTemplate } = templateSlice.actions;
export default templateSlice.reducer;
