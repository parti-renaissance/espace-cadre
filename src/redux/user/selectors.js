export const getCurrentUser = (state) => state.auth.user;

export const getUserScopes = (state) => state.auth.scopes || [];

export const getCurrentScope = (state) => state.auth.currentScope;

export const getAuthorizedPages = (state) => state.auth.authorizedPages;

export const isUserLogged = (state) => state.auth.isUserLogged;

export const getAccessToken = (state) => state.auth.tokens && state.auth.tokens.accessToken;
