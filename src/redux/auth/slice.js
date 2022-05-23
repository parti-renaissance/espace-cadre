import { createSlice } from '@reduxjs/toolkit'
import { APP_VERSION } from 'shared/environments'

const initialState = {
  isUserLogged: false,
  isSwitchUser: false,
  user: null,
  scopes: [],
  currentScope: null,
  tokens: null,
  authorizedPages: [],
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      const { tokens, isSwitchUser } = action.payload
      state.tokens = tokens
      state.isSwitchUser = isSwitchUser
      state.isUserLogged = true
      state.appVersion = APP_VERSION
      state.user = null
      state.scopes = []
      state.currentScope = null
    },
    userUpdateData(state, action) {
      state.user = action.payload
    },
    userUpdateScopes(state, action) {
      state.scopes = action.payload
    },
    updateCurrentScope(state, action) {
      state.currentScope = action.payload
    },
    updateAuthorizedPages(state, action) {
      state.authorizedPages = action.payload
    },
    getRefreshToken(state, action) {
      state.tokens = action.payload.tokens
    },
    userLogout(state, action) {
      return { ...initialState, isSwitchUser: action.payload }
    },
  },
})

export const {
  userLoggedIn,
  userUpdateData,
  userLogout,
  userUpdateScopes,
  updateCurrentScope,
  updateAuthorizedPages,
  getRefreshToken,
} = authSlice.actions
export default authSlice.reducer
