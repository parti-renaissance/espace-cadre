import { apiClientPublic } from 'services/networking/client'

export const signupQuery = data => apiClientPublic('post', 'api/membership?source=jemengage', data)
