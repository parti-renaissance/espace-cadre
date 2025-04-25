import axios from 'axios'
import qs from 'qs'
import { OAUTH_HOST, OAUTH_CLIENT_ID } from '~/shared/environments'
import { publicPaths } from '~/shared/paths'

const authCall = async payload => {
  const result = await axios.post(`${OAUTH_HOST}/oauth/v2/token`, qs.stringify(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  })
  return result.data
}

const login = async (fromRefreshToken = false, code, sessionId = null) => {
  let authPayload = {
    redirect_uri: window.location.origin + publicPaths.auth,
    client_id: OAUTH_CLIENT_ID,
  }
  if (fromRefreshToken) {
    authPayload = { ...authPayload, refresh_token: code, grant_type: 'refresh_token' }
  } else {
    authPayload = { ...authPayload, code, session_id: sessionId, grant_type: 'authorization_code' }
  }

  const result = await authCall(authPayload)

  if (result.access_token) {
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
      sessionId: result.id_token,
    }
  }
}

export default login
