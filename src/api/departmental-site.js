import { apiClient } from 'services/networking/client'

export const getDepartmentalSites = () => apiClient.get('/v3/department_sites')
export const createDepartmentalSite = data => apiClient.post('/v3/department_sites', data)
export const updateDepartmentalSite = (uuid, data) => apiClient.put(`/v3/department_sites/${uuid}`, data)
export const getDepartmentalSite = uuid => apiClient.get(`/v3/department_sites/${uuid}`)
