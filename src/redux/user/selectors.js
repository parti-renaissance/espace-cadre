export const getCurrentUser = state => state.auth.user

export const getUserScopes = state => state.auth.scopes || []

export const getCurrentScope = state => state.auth.currentScope

export const getAuthorizedPages = state => state.auth.authorizedPages

export const isUserLogged = state => state.auth.isUserLogged && state.auth.appVersion === process.env.REACT_APP_VERSION

export const isUserLoggedOut = state => !!state.auth.logoutProcess

export const getAccessToken = state => state.auth.tokens && state.auth.tokens.accessToken
