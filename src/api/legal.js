import { apiClientPublic } from 'services/networking/client'

export const rgpd = () => apiClientPublic('get', '/api/je-mengage/rgpd')
export const CGUQuery = () => apiClientPublic('get', '/api/pages/je-mengage-mentions-legales')
export const PPDQuery = () => apiClientPublic('get', '/api/pages/politique-protection-donnees')
