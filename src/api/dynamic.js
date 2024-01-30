import { apiClient } from '~/services/networking/client'

// Todo: create a specific method for each endpoint
// Waiting for Autocomplete to be refactor
export const getDataFromDynamicEndpoint = async (params, updater) => {
  const { uri, queryParam, query } = params
  const separator = uri.includes('?') ? '&' : '?'
  const formatedUri = `${uri}${separator}${queryParam}=${query}`
  const data = await apiClient.get(formatedUri)
  updater && updater(data)
}
