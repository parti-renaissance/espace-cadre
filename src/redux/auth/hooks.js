import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAsyncFn } from 'react-use'
import { useCallback } from 'react'
import login from '../../services/networking/auth'
import { apiClient } from '~/services/networking/client'
import { updateFeaturebaseToken, userLoggedIn, userUpdateData, userUpdateScopes } from './slice'
import { useUserScope } from '../user/hooks'
import paths, { publicPaths } from '~/shared/paths'
import { OAUTH_HOST, OAUTH_CLIENT_ID, NODE_ENV, FEATUREBASE_CLIENT_ID } from '~/shared/environments'
import { getFeaturebaseToken, getSessionId } from '~/redux/user/selectors.js'

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
  const sessionId = useSelector(getSessionId)

  return useAsyncFn(async (code, redirectPath, isSwitchUser) => {
    const data = await login(false, code, sessionId)
    dispatch(userLoggedIn({ tokens: data, isSwitchUser }))
    navigate(redirectPath ?? paths.dashboard)
  }, [])
}

export const useFeaturebaseToken = () => {
  const dispatch = useDispatch()

  return [
    useSelector(getFeaturebaseToken),
    useCallback(async () => {
      const data = await apiClient.get('/v3/sso/jwt/' + FEATUREBASE_CLIENT_ID)

      if (!data?.token) {
        return
      }

      dispatch(updateFeaturebaseToken(data.token))
    }, [dispatch]),
  ]
}

export const useGetUserData = () => {
  const dispatch = useDispatch()
  const [, updateCurrentScope] = useUserScope()

  return useAsyncFn(async () => {
    dispatch(userUpdateData(await apiClient.get('/me')))
    dispatch(userUpdateScopes(await apiClient.get('/v3/profile/me/scopes')))
  }, [dispatch, updateCurrentScope])
}
