import { apiClient } from '~/services/networking/client'
import qs from 'qs'
import Activist from '~/domain/activist'
import { PaginatedResult } from './pagination'
import { downloadFile } from './upload'
import { formatDate } from '~/shared/helpers'

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
        a.adherent_uuid,
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
export const exportActivists = async filter =>
  await downloadFile(
    `v3/adherents.xls?${qs.stringify(filter)}`,
    `Adherents Export - ${formatDate(new Date(), 'dd.MM.yyyy')}.xls`
  )
export const countAdherents = zoneUuids => apiClient.post('/v3/adherents/count', zoneUuids)

export const getAdherentElect = async uuid => await apiClient.get(`v3/adherents/${uuid}/elect`)
export const updateAdherentElect = async ({ data, uuid }) => await apiClient.put(`v3/adherents/${uuid}/elect`, data)
export const createMandate = async ({ data }) => await apiClient.post('/api/v3/elected_adherent_mandates', data)
export const updateMandate = async ({ data, uuid }) =>
  await apiClient.put(`/api/v3/elected_adherent_mandates/${uuid}`, data)
export const deleteMandate = async uuid => await apiClient.delete(`/api/v3/elected_adherent_mandates/${uuid}`)
