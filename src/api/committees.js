import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

export const getCommittees = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/committees?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
