import axios from 'axios'
import {
  getAccessToken as selectorGetAccessToken,
  getRefreshToken as selectorGetRefreshToken,
  getCurrentScope,
} from '../../redux/user/selectors'
import { store } from '../../redux/store'
import { userLogout, getRefreshToken } from '../../redux/auth'
import { API_HOST, INTERNAL_APP_ID } from 'shared/environments'
import login from './auth'

const API_BASE_URL = `${API_HOST}/api`

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({ baseURL })
    this.client.interceptors.request.use(
      config => {
        const token = ApiClient.getAccessToken()
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
      },
      error => Promise.reject(error)
    )
    this.client.interceptors.response.use(
      res => res,
      async error => {
        const config = error.config
        const currentRefreshToken = ApiClient.getRefreshToken()
        if (error.response && error.response.status === 401 && !config._retry) {
          if (currentRefreshToken) {
            config._retry = true
            try {
              const data = await login('token', currentRefreshToken)
              store.dispatch(getRefreshToken({ tokens: data }))
              return this.client(config)
            } catch (_error) {
              return Promise.reject(_error)
            }
          } else {
            store.dispatch(userLogout())
          }
        }
        return Promise.reject(error)
      }
    )
  }

  static getAccessToken() {
    return selectorGetAccessToken(store.getState())
  }

  static getRefreshToken() {
    return selectorGetRefreshToken(store.getState())
  }

  static getUserScope() {
    return getCurrentScope(store.getState())
  }

  async request(method, endpoint, data = null) {
    const config = {
      method,
      url: endpoint.replace(/^\/?api/, ''),
    }

    if (['post', 'put', 'patch'].includes(method) && data) {
      config.data = data
    }

    const userScope = ApiClient.getUserScope()

    if (userScope) {
      config.params = { scope: userScope.code }
    }

    try {
      const result = await this.client.request(config)
      return result.data
    } catch (error) {
      return error
    }
  }

  get(endpoint, headers = {}) {
    return this.request('get', endpoint, headers)
  }

  delete(endpoint, headers = {}) {
    return this.request('delete', endpoint, headers)
  }

  put(endpoint, data, headers = {}) {
    return this.request('put', endpoint, data, headers)
  }

  post(endpoint, data, headers = {}) {
    return this.request('post', endpoint, data, headers)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export const apiClientProxy = new ApiClient(`${API_BASE_URL}/v3/internal/${INTERNAL_APP_ID}`)
export const apiClientPublic = async (method, endpoint, body = null) => {
  const { data } = await axios.request({
    method,
    baseURL: API_BASE_URL,
    url: endpoint.replace(/^\/?api/, ''),
    data: body,
  })
  return data
}
