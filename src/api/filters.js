import { apiClient } from 'services/networking/client'

export const getFilters = async (feature, cb, apiUrl) => {
  const api = apiUrl ?? `adherents/filters?feature=${feature}`
  const filters = await apiClient.get(`v3/${api}`)
  cb && cb(filters)
  return filters
}
