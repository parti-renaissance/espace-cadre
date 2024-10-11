import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from 'react-use'
import { useCallback } from 'react'
import login from '../../services/networking/auth'
import { apiClient } from '~/services/networking/client'
import { userLoggedIn, userUpdateData, userUpdateScopes } from './slice'
import { useUserScope } from '../user/hooks'
import paths, { publicPaths } from '~/shared/paths'
import { OAUTH_HOST, OAUTH_CLIENT_ID, NODE_ENV } from '~/shared/environments'

export const useInitializeAuth = () => {
  const dispatch = useDispatch()

  return useCallback(() => {
    dispatch(userUpdateData(null))

    if (NODE_ENV !== 'production' && !OAUTH_HOST) {
      window.location.href = '/auth?code=fake_authorization_code'
      return
    }

    window.location.href = `${OAUTH_HOST}/oauth/v2/auth?response_type=code&client_id=${OAUTH_CLIENT_ID}&scope=jemengage_admin&redirect_uri=${window.location.origin}${publicPaths.auth}`
  }, [dispatch])
}

export const useRequestAccessToken = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useAsyncFn(async (code, redirectPath, isSwitchUser) => {
    const data = await login(false, code)
    dispatch(userLoggedIn({ tokens: data, isSwitchUser }))
    navigate(redirectPath ?? paths.dashboard)
  }, [])
}

export const useGetUserData = () => {
  const dispatch = useDispatch()
  const [, updateCurrentScope] = useUserScope()

  return useAsyncFn(async () => {
    dispatch(userUpdateData(await apiClient.get('/me')))
    dispatch(userUpdateScopes(await apiClient.get('/v3/profile/me/scopes')))
  }, [dispatch, updateCurrentScope])
}
