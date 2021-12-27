import { apiClientProxy } from 'services/networking/client'

export const downloadsCount = () => apiClientProxy.get('/jemengage/downloads')
