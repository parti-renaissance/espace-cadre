import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { newPaginatedResult } from 'api/pagination'

export const getAllElected = async filter => {
  const data = await apiClient.get(`api/v3/elected_representatives?${qs.stringify(filter)}`)
  return newPaginatedResult(data.items, data.metadata)
}

export const getElected = async uuid => {
  const data = await apiClient.get(`/api/v3/elected_representatives/${uuid}`)
  return data
}

export const createElected = async elected => {
  const data = await apiClient.post('/api/v3/elected_representatives', elected)
  return data
}
export const updateElected = async elected => {
  const data = await apiClient.put(`/api/v3/elected_representatives/${elected.uuid}`, elected)
  return data
}
