import { apiClient } from '../services/networking/client'

export const getMessage = (id) => apiClient.get(`/v3/adherent_messages/${id}`)
export const getMessageContent = (id) => apiClient.get(`/v3/adherent_messages/${id}/content`)
export const createMessage = (data) => apiClient.post('/v3/adherent_messages', data)
export const updateMessage = (id, data) => apiClient.put(`/v3/adherent_messages/${id}`, data)
export const sendMessage = (id) => apiClient.post(`/v3/adherent_messages/${id}/send`)
export const sendTestMessage = (id) => apiClient.post(`/v3/adherent_messages/${id}/send-test`)
export const setMessageSegment = (messageId, segmentId) => apiClient.put(`/v3/adherent_messages/${messageId}/filter`, { segment: segmentId })

export const getSegmentAudience = (id) => apiClient.get(`/v3/audience-segments/${id}`)
export const createSegmentAudience = (data) => apiClient.post('/v3/audience-segments', data)
export const updateSegmentAudience = (id, data) => apiClient.put(`/v3/audience-segments/${id}`, data)
