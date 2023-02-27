import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { PaginatedResult } from './pagination'

export const getDocuments = async filters => {
  const data = await apiClient.get(`/v3/documents?${qs.stringify(filters)}`)

  return new PaginatedResult(
    data.items,
    data.metadata.total_items,
    data.metadata.items_per_page,
    data.metadata.count,
    data.metadata.current_page,
    data.metadata.last_page
  )
}
