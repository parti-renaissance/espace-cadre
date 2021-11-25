import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from 'react-use'
import { useCallback } from 'react'
import login from '../../services/networking/auth'
import { apiClient } from 'services/networking/client'
import { userLoggedIn, userUpdateData, userUpdateScopes } from './slice'
import { useUserScope } from '../user/hooks'
import paths from 'shared/paths'

export const useInitializeAuth = () => {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(userUpdateData(null))

    if (process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_OAUTH_HOST) {
      window.location.href = '/auth?code=fake_authorization_code'
      return
    }

    window.location.href = `${process.env.REACT_APP_OAUTH_HOST}/oauth/v2/auth?response_type=code&client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}`
  }, [dispatch])
}

export const useRequestAccessToken = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useAsyncFn(async code => {
    const data = await login(code)
    dispatch(userLoggedIn(data))
    navigate(paths.dashboard)
  }, [])
}

export const useGetUserData = () => {
  const dispatch = useDispatch()
  const [, updateCurrentScope] = useUserScope()

  return useAsyncFn(async () => {
    const data = await apiClient.get('/me')
    dispatch(userUpdateData(data))

    const scopes = await apiClient.get('/v3/profile/me/scopes')
    if (scopes.length === 1) {
      updateCurrentScope(scopes[0]).then(() => dispatch(userUpdateScopes(scopes)))
    } else {
      dispatch(userUpdateScopes(scopes))
    }
  }, [dispatch, updateCurrentScope])
}
