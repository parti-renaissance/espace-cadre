import { apiClientPublic } from 'services/networking/client'

export const rgpd = () => apiClientPublic('get', '/api/je-mengage/rgpd')
