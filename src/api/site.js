import { apiClient } from 'services/networking/client'

export const getSites = () => apiClient.get('/v3/department_sites')
export const createSiteContent = data => apiClient.post('/v3/department_sites', data)
export const updateSiteContent = (id, data) => apiClient.put(`/v3/department_sites/${id}`, data)
export const getSiteContent = id => apiClient.get(`/v3/department_sites/${id}`)
