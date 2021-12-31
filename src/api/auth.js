import axios from 'axios'
import qs from 'qs'
import { apiClient } from 'services/networking/client'
import User from 'domain/user'

export const getTokens = async (login, password) => {
  const payload = {
    client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    grant_type: 'password',
    username: login,
    password: password,
  }

  const response = await axios.post(`${process.env.REACT_APP_OAUTH_HOST}/oauth/v2/token`, qs.stringify(payload), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  })

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  }
}

export const userInfos = async () => {
  const data = await apiClient.get('/me')
  return new User(data.id, data.first_name, data.last_name)
}

export const userScopes = () => apiClient.get('/v3/profile/me/scopes')
