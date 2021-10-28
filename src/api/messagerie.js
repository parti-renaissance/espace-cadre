import { apiClient } from '../services/networking/client';

export const getMessage = async (id) => apiClient.get(`/v3/adherent_messages/${id}`)
export const getMessageContent = async (id) => apiClient.get(`/v3/adherent_messages/${id}/content`)
export const createMessage = async (data) => apiClient.post('/v3/adherent_messages', data);
export const updateMessage = async (id, data) => apiClient.put(`/v3/adherent_messages/${id}`, data)
export const sendMessage = async (id) => apiClient.post(`/v3/adherent_messages/${id}/send`);
export const sendTestMessage = async (id) => apiClient.post(`/v3/adherent_messages/${id}/send-test`);
export const setMessageSegment = async (messageId, segmentId) => apiClient.put(`/v3/adherent_messages/${messageId}/filter`, { segment: segmentId });

export const getSegmentAudience = async (id) => apiClient.get(`/v3/audience-segments/${id}`)
export const createSegmentAudience = async (data) => apiClient.post('/v3/audience-segments', data)
export const updateSegmentAudience = async (id, data) => apiClient.put(`/v3/audience-segments/${id}`, data)
