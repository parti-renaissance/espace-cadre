import { apiClientPublic } from 'services/networking/client'

export const RGPDQuery = () => apiClientPublic('get', '/api/je-mengage/rgpd')
export const CGUQuery = () => apiClientPublic('get', '/api/je-mengage/je-mengage-web-mentions-legales')
export const PPDQuery = () => apiClientPublic('get', '/api/je-mengage/politique-protection-donnees')
