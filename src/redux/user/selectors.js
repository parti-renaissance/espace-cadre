import { APP_VERSION } from '~/shared/environments'
import { Scope } from '~/domain/scope'
import { createSelector } from '@reduxjs/toolkit'

export const getCurrentUser = state => state.auth.user

export const getUserScopes = state => state.auth.scopes || []

export const getCurrentScope = createSelector(
  state => (state.auth.currentScope ? new Scope(state.auth.currentScope) : null),
  scope => scope
)

export const isUserLogged = state => state.auth.isUserLogged && state.auth.appVersion === APP_VERSION

export const isSwitchUser = state => state.auth.isSwitchUser || false

export const getAccessToken = state => state.auth.tokens && state.auth.tokens.accessToken

export const getRefreshToken = state => state.auth.tokens && state.auth.tokens.refreshToken
