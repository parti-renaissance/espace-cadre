import { apiClient } from 'services/networking/client'
import qs from 'qs'
import Activist from 'domain/activist'
import { PaginatedResult } from './pagination'
import { downloadFile } from './upload'

export const getActivists = async filter => {
  const data = await apiClient.get(`v3/adherents?${qs.stringify(filter)}`)
  const activists = data.items.map(
    a =>
      new Activist(
        a.first_name,
        a.last_name,
        a.gender,
        a.country,
        a.city_code,
        a.city,
        a.committee,
        a.committee_uuid,
        a.postal_code,
        a.interests,
        a.email_subscription,
        a.last_membership_donation,
        a.created_at,
        a
      )
  )
  return new PaginatedResult(
    activists,
    data.metadata.total_items,
    data.metadata.items_per_page,
    data.metadata.count,
    data.metadata.current_page,
    data.metadata.last_page
  )
}
export const exportActivists = filter => downloadFile(`v3/adherents.xls?${qs.stringify(filter)}`)
export const countAdherents = zoneUuids => apiClient.post('/v3/adherents/count', zoneUuids)
