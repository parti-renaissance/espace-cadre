import { format } from 'date-fns'
import { apiClient } from 'services/networking/client'

export const createDesignation = async designation => {
  const data = await apiClient.post('/v3/designations', designationToJson(designation))
  return data.uuid
}
export const updateDesignation = async designation => {
  const data = await apiClient.put(`/v3/designations/${designation.id}`, designationToJson(designation))
  return data.uuid
}

const designationToJson = designation => ({
  id: designation.id,
  custom_title: designation.title,
  election_creation_date: format(designation.electionDate, 'yyyy-MM-dd HH:mm'),
  description: designation.description,
  vote_start_date: format(designation.voteStartDate, 'yyyy-MM-dd HH:mm'),
  vote_end_date: format(designation.voteEndDate, 'yyyy-MM-dd HH:mm'),
  type: 'committee_supervisor',
  election_entity_identifier: designation.committeeUuid,
})
