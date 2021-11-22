import axios from 'axios'
import { getAccessToken as selectorGetAccessToken, getCurrentScope } from '../../redux/user/selectors'
import { store } from '../../redux/store'
import { userLogout } from '../../redux/auth'
import { setError } from '../../redux/errors'

const API_BASE_URL = `${process.env.REACT_APP_OAUTH_HOST}/api`

const handleHttpError = error => {
  const { response = {}, message, stack: detail } = error
  if (!response.status) store.dispatch(setError({ type: 'unknown', message, detail }))
  if (response.status === 500) store.dispatch(setError({ type: 500 }))
  if (response.status === 401) store.dispatch(userLogout())
  throw error
}

class ApiClient {
  constructor(baseURL) {
    this.client = axios.create({ baseURL })
  }

  static getAccessToken() {
    return selectorGetAccessToken(store.getState())
  }

  static getUserScope() {
    return getCurrentScope(store.getState())
  }

  async request(method, endpoint, data = null, headers = {}) {
    const config = {
      method,
      url: endpoint.replace(/^\/?api/, ''),
      headers: {
        ...{
          Authorization: `Bearer ${ApiClient.getAccessToken()}`,
        },
        ...headers,
      },
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
      return handleHttpError(error)
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
export const apiClientProxy = new ApiClient(`${API_BASE_URL}/v3/internal/${process.env.REACT_APP_INTERNAL_APP_ID}`)
