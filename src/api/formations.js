import { apiClient } from '~/services/networking/client'
import { newPaginatedResult } from '~/api/pagination'
import { downloadFile } from './upload'

export const getFormations = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/formations?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
export const createFormation = async formation => await apiClient.post('/api/v3/formations', formation)
export const updateFormation = async formation => await apiClient.put(`/api/v3/formations/${formation.uuid}`, formation)
export const deleteFormation = async uuid => await apiClient.delete(`/api/v3/formations/${uuid}`)
export const downloadFormation = (uuid, endpoint) => downloadFile(`/api/v3/${endpoint}/${uuid}/file`)
