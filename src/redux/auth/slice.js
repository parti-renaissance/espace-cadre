import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isUserLogged: false,
    user: null,
    scopes: [],
    currentScope: null,
    tokens: null,
    authorizedPages: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn(state, action) {
            state.tokens = action.payload;
            state.isUserLogged = true;
        },
        userUpdateData(state, action) {
            state.user = action.payload;
        },
        userUpdateScopes(state, action) {
            state.scopes = action.payload;
        },
        updateCurrentScope(state, action) {
            state.currentScope = action.payload;
        },
        updateAuthorizedPages(state, action) {
            state.authorizedPages = action.payload;
        },
        userLogout() {
            return initialState;
        },
    },
});

export const {
    userLoggedIn, userUpdateData, userLogout, userUpdateScopes, updateCurrentScope, updateAuthorizedPages,
} = authSlice.actions;
export default authSlice.reducer;
