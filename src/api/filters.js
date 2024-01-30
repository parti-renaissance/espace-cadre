import { apiClient } from '~/services/networking/client'

export const getFilters = async (feature, callback = null) => {
  const filters = await apiClient.get(`/v3/filters?feature=${feature}`)

  if (typeof callback === 'function') {
    callback(filters)
  }

  return filters
}
