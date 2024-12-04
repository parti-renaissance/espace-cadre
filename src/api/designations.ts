import { apiClient } from '~/services/networking/client'
import { Designation, DesignationTypeEnum } from '~/domain/designation'
import { downloadFile } from '~/api/upload'

export const getDesignations = async (types: DesignationTypeEnum[]): Promise<Designation[]> => {
  const data = await apiClient.get(`/v3/designations?${types.map(type => `type[]=${type}`).join('&')}`)
  return data.items.map((designation: any) => Designation.fromApi(designation))
}

export const getDesignation = async (uuid: string) => {
  const data = await apiClient.get(`/v3/designations/${uuid}`)
  return Designation.fromApi(data)
}

export const createDesignation = (designation: Designation) => apiClient.post('/v3/designations', designation.toJson())
export const updateDesignation = (designation: Designation) =>
  apiClient.put(`/v3/designations/${designation.id}`, designation.toJson())
export const cancelDesignation = async (uuid: string) => await apiClient.put(`/v3/designations/${uuid}/cancel`)
export const resultsDesignation = async (uuid: string) => await apiClient.get(`/v3/designations/${uuid}/results`)
export const getVoters = async (uuid: string) => await apiClient.get(`/v3/designations/${uuid}/voters`)
export const downloadVoters = uuid => downloadFile(`/v3/designations/${uuid}/voters.xlsx`)
export const downloadBallots = uuid => downloadFile(`/v3/designations/${uuid}/ballots.xlsx`)
