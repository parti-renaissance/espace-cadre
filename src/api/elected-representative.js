import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { newPaginatedResult } from 'api/pagination'

export const getAllElected = async filter => {
  const data = await apiClient.get(`api/v3/elected_representatives?${qs.stringify(filter)}`)
  return newPaginatedResult(data.items, data.metadata)
}

export const getElected = async uuid => await apiClient.get(`/api/v3/elected_representatives/${uuid}`)
export const createElected = async elected => await apiClient.post('/api/v3/elected_representatives', elected)
export const updateElected = async elected =>
  await apiClient.put(`/api/v3/elected_representatives/${elected.uuid}`, elected)
