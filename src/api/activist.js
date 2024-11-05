import { apiClient } from '~/services/networking/client'
import qs from 'qs'
import { downloadFile } from './upload'
import { formatDate } from '~/shared/helpers'

export const exportActivists = async filter =>
  await downloadFile(
    `v3/adherents.xls?${qs.stringify(filter)}`,
    `Adherents Export - ${formatDate(new Date(), 'dd.MM.yyyy')}.xls`
  )
export const countAdherents = (zoneUuids, since = null) =>
  apiClient.post(`/v3/adherents/count?since=${since ?? ''}`, zoneUuids)

export const getAdherentElect = async uuid => await apiClient.get(`v3/adherents/${uuid}/elect`)
export const updateAdherentElect = async ({ data, uuid }) => await apiClient.put(`v3/adherents/${uuid}/elect`, data)
export const createMandate = async ({ data }) => await apiClient.post('/api/v3/elected_adherent_mandates', data)
export const updateMandate = async ({ data, uuid }) =>
  await apiClient.put(`/api/v3/elected_adherent_mandates/${uuid}`, data)
export const deleteMandate = async uuid => await apiClient.delete(`/api/v3/elected_adherent_mandates/${uuid}`)
