export const getCurrentUser = (state) => {
    return state.auth.user;
}

export const isUserLogged = (state) => {
    return state.auth.isUserLogged;
}

export const getAccessToken = (state) => {
    return state.auth.tokens.accessToken;
}
