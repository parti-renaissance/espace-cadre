import { apiClient } from '~/services/networking/client'

export const getHubItems = async () => {
  const { items } = await apiClient.get('/v3/hub-items')

  return items ?? []
}
