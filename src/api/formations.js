import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

export const getFormations = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/formations?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
export const createFormation = async formation => await apiClient.post('/api/v3/formations', formation)
export const updateFormation = async formation => await apiClient.put(`/api/v3/formations/${formation.uuid}`, formation)
export const uploadFile = async ({ uuid, file }) => {
  const formData = new FormData()
  formData.append('file', file)
  return await apiClient.post(`/api/v3/formations/${uuid}/file`, formData, { 'Content-Type': 'multipart/form-data' })
}
export const getFile = async uuid => await apiClient.get(`/api/v3/formations/${uuid}/file`)
export const deleteFormation = async uuid => await apiClient.delete(`/api/v3/formations/${uuid}`)
