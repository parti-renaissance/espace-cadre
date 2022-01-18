import { apiClientPublic } from 'services/networking/client'

export const rgpd = () => apiClientPublic('get', '/api/je-mengage/rgpd')
export const cgu = () => apiClientPublic('get', '/api/pages/je-mengage-mentions-legales')
export const ppd = () => apiClientPublic('get', '/api/je-mengage/politique-protection-donnees')
