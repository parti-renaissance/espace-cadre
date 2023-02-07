import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { newPaginatedResult } from 'api/pagination'

export const getElected = async filter => {
  const data = await apiClient.get(`api/v3/elected_representatives?${qs.stringify(filter)}`)
  return newPaginatedResult(data.items, data.metadata)
}
