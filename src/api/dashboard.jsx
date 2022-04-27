import { apiClientProxy } from 'services/networking/client'

export const downloadsCount = () => apiClientProxy.get('/jemengage/downloads')
export const usersCount = () => apiClientProxy.get('/jemengage/users')
export const adherentsCount = () => apiClientProxy.get('/adherents')
