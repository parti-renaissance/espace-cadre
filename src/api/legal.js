import { apiClientPublic } from '~/services/networking/client'

export const RGPDQuery = () => apiClientPublic('get', '/api/je-mengage/rgpd')
export const PPDQuery = () => apiClientPublic('get', '/api/je-mengage/politique-protection-donnees')
export const CGUQueryWeb = () => apiClientPublic('get', '/api/je-mengage/je-mengage-web-mentions-legales')
export const CGUQueryMobile = () => apiClientPublic('get', '/api/je-mengage/je-mengage-mobile-mentions-legales')
export const CookiesQueryWeb = () =>
  apiClientPublic('get', '/api/je-mengage/je-mengage-web-politique-utilisation-des-cookies')
export const CookiesQueryMobile = () =>
  apiClientPublic('get', '/api/je-mengage/je-mengage-mobile-politique-utilisation-des-cookies')
