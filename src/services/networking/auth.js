import axios from 'axios'
import qs from 'qs'
import { OAUTH_HOST, OAUTH_CLIENT_ID } from 'shared/environments'

const authCall = async payload => {
  try {
    const result = await axios.post(`${OAUTH_HOST}/oauth/v2/token`, qs.stringify(payload), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    })

    return result.data
  } catch (error) {
    // TODO : Error management
  }

  return {}
}

const login = async (type, params) => {
  let authPayload = {
    client_id: OAUTH_CLIENT_ID,
  }
  if (type === 'code') {
    authPayload = { ...authPayload, code: params, grant_type: 'authorization_code' }
  } else {
    authPayload = { ...authPayload, refresh_token: params, grant_type: 'refresh_token' }
  }
  const result = await authCall(authPayload)

  if (result.access_token) {
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresIn: result.expires_in,
    }
  }

  throw new Error('Error!')
}

export default login
