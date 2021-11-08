import { apiClient } from 'services/networking/client'

export const getFilters = async (id, cb) => {
  const filters = await apiClient.get(`/v3/adherent_messages/${id}`)
  cb && cb(filters)
  return filters
}
