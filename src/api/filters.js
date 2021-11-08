import { apiClient } from 'services/networking/client'

export const getFilters = async (feature, cb) => {
  const filters = await apiClient.get(`v3/adherents/filters?feature=${feature}`)
  cb && cb(filters)
  return filters
}
