import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { newPaginatedResult } from 'api/pagination'
import { Mandate } from 'domain/elected_representative'
import { format } from 'date-fns'

export const getAllElected = async filter => {
  const data = await apiClient.get(`api/v3/elected_representatives?${qs.stringify(filter)}`)
  return newPaginatedResult(data.items, data.metadata)
}

export const getElected = async uuid => {
  const data = await apiClient.get(`/api/v3/elected_representatives/${uuid}`)
  const mandates = data.mandates.map(
    mandate =>
      new Mandate(
        mandate.uuid,
        mandate.begin_at,
        mandate.finish_at,
        mandate.type,
        mandate.is_elected,
        mandate.on_going,
        mandate.geo_zone,
        mandate.political_affiliation,
        mandate.la_r_e_m_support,
        mandate.political_functions
      )
  )

  return { ...data, mandates }
}
export const createElected = async elected => await apiClient.post('/api/v3/elected_representatives', elected)
export const updateElected = async elected =>
  await apiClient.put(`/api/v3/elected_representatives/${elected.uuid}`, elected)

export const createMandate = async mandate => await apiClient.post('/api/v3/elected_mandates', mandateToJson(mandate))
export const updateMandate = async mandate =>
  await apiClient.put(`/api/v3/elected_mandates/${mandate.id}`, mandateToJson(mandate))
export const deleteMandate = async uuid => await apiClient.delete(`/api/v3/elected_mandates/${uuid}`)

const mandateToJson = mandate => ({
  type: mandate.type,
  is_elected: mandate.isElected,
  on_going: mandate.onGoing,
  elected_representative: mandate.electedRepresentative,
  begin_at: format(mandate.beginAt, 'yyyy-MM-dd HH:mm:ss'),
  finish_at: mandate.finishAt ? format(mandate.finishAt, 'yyyy-MM-dd HH:mm:ss') : null,
  political_affiliation: mandate.politicalAffiliation,
  political_functions: mandate.politicalFunctions,
  la_r_e_m_support: mandate.laREMSupport ?? null,
  geo_zone: mandate.geoZone,
})
