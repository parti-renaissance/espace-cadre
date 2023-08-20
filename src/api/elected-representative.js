import { apiClient } from 'services/networking/client'
import qs from 'qs'
import { newPaginatedResult } from 'api/pagination'
import { Elected, ElectedRepresentative, Mandate } from 'domain/elected_representative'
import { formatDate } from 'shared/helpers'

export const getAllElected = async filter => {
  const data = await apiClient.get(`api/v3/elected_representatives?${qs.stringify(filter)}`)
  const allElected = data.items.map(
    item =>
      new ElectedRepresentative(
        item.uuid,
        item.first_name,
        item.last_name,
        item.gender,
        item.contact_phone,
        item.last_contribution,
        item.contribution_status,
        item.contributed_at,
        item.current_mandates,
        item.current_political_functions
      )
  )
  return newPaginatedResult(allElected, data.metadata)
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

  return new Elected(
    data.uuid,
    data.first_name,
    data.last_name,
    data.gender,
    data.contact_phone,
    data.email_address,
    data.contact_email,
    data.birth_date,
    data.birth_place,
    data.has_followed_training,
    data.adherent,
    mandates,
    data.payments
  )
}
export const createElected = async elected =>
  await apiClient.post('/api/v3/elected_representatives', electedToJson(elected))
export const updateElected = async elected =>
  await apiClient.put(`/api/v3/elected_representatives/${elected.id}`, electedToJson(elected))

export const createMandate = async mandate => await apiClient.post('/api/v3/elected_mandates', mandateToJson(mandate))
export const updateMandate = async mandate =>
  await apiClient.put(`/api/v3/elected_mandates/${mandate.id}`, mandateToJson(mandate))
export const deleteMandate = async uuid => await apiClient.delete(`/api/v3/elected_mandates/${uuid}`)

const mandateToJson = mandate => ({
  type: mandate.type,
  is_elected: mandate.isElected,
  on_going: mandate.onGoing,
  elected_representative: mandate.electedRepresentative,
  begin_at: formatDate(mandate.beginAt, 'yyyy-MM-dd HH:mm:ss'),
  finish_at: mandate.finishAt ? formatDate(mandate.finishAt, 'yyyy-MM-dd HH:mm:ss') : null,
  political_affiliation: mandate.politicalAffiliation,
  political_functions: mandate.politicalFunctions,
  la_r_e_m_support: mandate.laREMSupport ?? null,
  geo_zone: mandate.geoZone,
})

const electedToJson = elected => ({
  first_name: elected.firstName,
  last_name: elected.lastName,
  gender: elected.gender,
  birth_date: formatDate(elected.birthDate, 'yyyy-MM-dd'),
  birth_place: elected.birthPlace,
  contact_email: elected.contactEmail,
  contact_phone: elected.contactPhone,
  has_followed_training: elected.hasFollowedTraining,
  adherent: elected.adherent,
})
