import { apiClient } from '~/services/networking/client'
import { formatDate, parseDate } from '~/shared/helpers'
import { Designation } from '~/domain/designation'

export const getDesignations = async (type: string): Promise<Designation[]> => {
  const data = await apiClient.get(`/v3/designations?type=${type}`)
  return data.items.map(
    designation =>
      new Designation(
        designation.uuid,
        designation.custom_title,
        designation.description,
        null,
        parseDate(designation.vote_start_date),
        parseDate(designation.vote_end_date)
      )
  )
}

export const getDesignation = async id => {
  const data = await apiClient.get(`/v3/designations/${id}`)
  return new Designation(
    data.uuid,
    data.custom_title,
    data.description,
    parseDate(data.election_creation_date),
    parseDate(data.vote_start_date),
    parseDate(data.vote_end_date)
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
  custom_title: designation.customTitle,
  description: designation.description,
  vote_start_date: formatDate(designation.voteStartDate, 'yyyy-MM-dd HH:mm:ss'),
  vote_end_date: formatDate(designation.voteEndDate, 'yyyy-MM-dd HH:mm:ss'),
  type: 'committee_supervisor',
  election_entity_identifier: designation.committeeUuid,
})
