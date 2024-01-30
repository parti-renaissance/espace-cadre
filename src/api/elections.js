import { apiClientProxy } from '~/services/networking/client'
import qs from 'qs'

import { ElectionParticipation, ElectionResult } from '../domain/election'

const formatElectionParticipation = (results = []) =>
  results.map(
    ({ inscrits: registered, votants: voting, exprimes: votesCast }) =>
      new ElectionParticipation(registered, voting, votesCast)
  )

const formatElectionResults = (results = []) =>
  results.map(
    ({ nuance, code_couleur: colorCode, prenom: candidateFirstname, nom: candidateLastname, voix: votesCount }) =>
      new ElectionResult(nuance, colorCode, candidateFirstname, candidateLastname, votesCount)
  )

export const getElectionParticipation = async (params, updater) => {
  const query = {
    maillage: params.layerCode,
    code_zone: params.zoneCode,
    election: params.election,
    tour: params.stage,
  }
  const url = `/election/participation?${qs.stringify(query)}`
  const data = await apiClientProxy.get(url)
  const participation = formatElectionParticipation(data)
  updater && updater(participation)
}

export const getElectionResults = async (params, updater) => {
  const query = {
    maillage: params.layerCode,
    code_zone: params.zoneCode,
    election: params.election,
    tour: params.stage,
  }
  const url = `/election/results?${qs.stringify(query)}`
  const data = await apiClientProxy.get(url)
  const result = formatElectionResults(data)
  updater && updater(result)
}
