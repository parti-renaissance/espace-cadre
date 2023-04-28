import qs from 'qs'
import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'
import { ZONE_AUTOCOMPLETE_URI } from 'components/Filters/Element/ZoneAutocomplete'

export const getCommittees = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/committees?page=${page}&page_size=20`)
  return newPaginatedResult(data.items, data.metadata)
}
export const getCommittee = async committeeId => await apiClient.get(`/v3/committees/${committeeId}`)
export const getZones = async filters =>
  await apiClient.get(
    `${ZONE_AUTOCOMPLETE_URI}?${qs.stringify({
      ...filters,
      searchEvenEmptyTerm: 1,
      availableForCommittee: 1,
      noLimit: 1,
    })}`
  )
export const updateAnimator = async ({ committeeId, animatorId }) =>
  await apiClient.put(`/v3/committees/${committeeId}/animator`, { animator: animatorId })
export const getUsedZones = async () => await apiClient.get('/v3/committees/used-zones')
export const createCommittee = async committee => await apiClient.post('/v3/committees', committee)
export const updateCommittee = async committee => await apiClient.put(`/v3/committees/${committee.uuid}`, committee)
export const deleteCommittee = async committeeId => await apiClient.delete(`/v3/committees/${committeeId}`)
