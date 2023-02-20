import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

export const getDocuments = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/general_meeting_reports?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
export const createDocument = async document => await apiClient.post('/api/v3/general_meeting_reports', document)
export const updateDocument = async document =>
  await apiClient.put(`/api/v3/general_meeting_reports/${document.uuid}`, document)
