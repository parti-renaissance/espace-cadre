import { apiClient } from '~/services/networking/client'
import { CommitteeElection } from '~/domain/committee_election'
import { Designation } from '~/domain/designation'

export const getCommitteeElection = async committeeElectionId => {
  const committeeElection = await apiClient.get(`/v3/committee_elections/${committeeElectionId}`)

  return new CommitteeElection(
    committeeElection.uuid,
    Designation.fromApi(committeeElection.designation),
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
