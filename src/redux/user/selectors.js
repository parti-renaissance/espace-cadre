export const getCurrentUser = (state) => state.auth.user;

export const getUserScopes = (state) => state.auth.scopes;

export const isUserLogged = (state) => state.auth.isUserLogged;

export const getAccessToken = (state) => state.auth.tokens.accessToken;
