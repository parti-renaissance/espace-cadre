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
export const getFile = async uuid => {
  const response = await apiClient.request(
    'get',
    `/api/v3/formations/${uuid}/file`,
    null,
    {},
    { responseType: 'blob' },
    true
  )

  return {
    blob: new Blob([response.data], { type: response.headers.get('content-type') }),
    fileName: response.headers.has('content-disposition')
      ? response.headers.get('content-disposition').split('filename=')[1]
      : 'formation',
  }
}
export const deleteFormation = async uuid => await apiClient.delete(`/api/v3/formations/${uuid}`)
