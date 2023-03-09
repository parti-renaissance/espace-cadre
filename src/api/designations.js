import { apiClient } from 'services/networking/client'

export const createDesignation = async designation => await apiClient.post('/v3/designations', designation)
export const updateDesignation = async designation =>
  await apiClient.put(`/v3/designations/${designation.uuid}`, designation)
