import { apiClient } from 'services/networking/client'

export const getCommitteeElection = async committeeElectionId =>
  await apiClient.get(`/v3/committee_elections/${committeeElectionId}`)
export const createGroup = async electionId =>
  await apiClient.post('/v3/committee_candidacies_groups', { election: electionId })
export const deleteGroup = async groupId => await apiClient.delete(`/v3/committee_candidacies_groups/${groupId}`)
export const addCandidate = async candidate => await apiClient.post('/v3/committee_candidacies', candidate)
export const removeCandidate = async candidateId => await apiClient.delete(`/v3/committee_candidacies/${candidateId}`)
