import { apiClient } from '~/services/networking/client'
import { CommitteeElection, Designation } from '~/domain/committee_election'
import { parseDate } from '~/shared/helpers'

export const getCommitteeElection = async committeeElectionId => {
  const committeeElection = await apiClient.get(`/v3/committee_elections/${committeeElectionId}`)
  const designation = new Designation(
    committeeElection.designation.uuid,
    committeeElection.designation.custom_title,
    committeeElection.designation.description,
    parseDate(committeeElection.designation.election_creation_date),
    parseDate(committeeElection.designation.vote_start_date),
    parseDate(committeeElection.designation.vote_end_date)
  )

  return new CommitteeElection(
    committeeElection.uuid,
    designation,
    committeeElection.candidacies_groups,
    committeeElection.status,
    committeeElection.voters_count,
    committeeElection.votes_count,
    committeeElection.committee.uuid
  )
}
export const createGroup = async electionId =>
  await apiClient.post('/v3/committee_candidacies_groups', { election: electionId })
export const deleteGroup = async groupId => await apiClient.delete(`/v3/committee_candidacies_groups/${groupId}`)
export const addCandidate = async candidate => await apiClient.post('/v3/committee_candidacies', candidate)
export const removeCandidate = async candidateId => await apiClient.delete(`/v3/committee_candidacies/${candidateId}`)
