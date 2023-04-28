import { formatISO } from 'date-fns'
import { Designation } from 'domain/committee_election'
import { apiClient } from 'services/networking/client'

export const getDesignation = async id => {
  const data = await apiClient.get(`/v3/designations/${id}`)
  return new Designation(
    data.uuid,
    data.custom_title,
    data.description,
    data.election_creation_date,
    data.vote_start_date,
    data.vote_end_date
  )
}
export const createDesignation = async designation => {
  const data = await apiClient.post('/v3/designations', designationToJson(designation))
  return data.uuid
}
export const updateDesignation = async designation => {
  const data = await apiClient.put(`/v3/designations/${designation.id}`, designationToJson(designation))
  return data.uuid
}
export const cancelDesignation = async designationId => await apiClient.put(`/v3/designations/${designationId}/cancel`)
export const resultsDesignation = async id => await apiClient.get(`/v3/designations/${id}/results`)
export const getVoters = async id => await apiClient.get(`/v3/designations/${id}/voters`)
const designationToJson = designation => ({
  id: designation.id,
  custom_title: designation.title,
  description: designation.description,
  vote_start_date: formatISO(designation.voteStartDate),
  vote_end_date: formatISO(designation.voteEndDate),
  type: 'committee_supervisor',
  election_entity_identifier: designation.committeeUuid,
})
