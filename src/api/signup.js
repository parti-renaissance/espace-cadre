import { apiClientPublic } from 'services/networking/client'

export const signup = data => apiClientPublic('post', 'api/membership?source=jemengage', data)
