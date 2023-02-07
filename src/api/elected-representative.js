import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

export const getElected = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/elected_representatives?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
