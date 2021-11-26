import { apiClient } from 'services/networking/client'
import PaginatedResult from 'api/paginatedResult'
import Message, { Statistics } from 'domain/message'

export const getMessages = async cb => {
  const data = await apiClient.get('/v3/adherent_messages')

  const messages = data.items.map(message => {
    const { statistics: s } = message
    const stats = new Statistics(
      s.sent,
      s.opens,
      s.open_rate,
      s.clicks,
      s.click_rate,
      s.unsubscribe,
      s.unsubscribe_rate
    )

    return new Message(message.uuid, message.from_name, message.status, message.subject, null, stats)
  })

  const paginatedMessages = new PaginatedResult(
    messages,
    data.metadata.total_items,
    data.metadata.items_per_page,
    data.metadata.count,
    data.metadata.current_page,
    data.metadata.last_page
  )

  cb && cb(paginatedMessages)
  return paginatedMessages
}
export const messageSynchronizationStatus = async id => {
  const data = await apiClient.get(`/v3/adherent_messages/${id}`)
  return { synchronized: data.synchronized }
}
export const getMessageContent = id => apiClient.get(`/v3/adherent_messages/${id}/content`)
export const createMessageContent = data => apiClient.post('/v3/adherent_messages', data)
export const updateMessageContent = (id, data) => apiClient.put(`/v3/adherent_messages/${id}`, data)
export const sendMessage = id => apiClient.post(`/v3/adherent_messages/${id}/send`)
export const sendTestMessage = id => apiClient.post(`/v3/adherent_messages/${id}/send-test`)
export const setMessageSegment = (messageId, segmentId) =>
  apiClient.put(`/v3/adherent_messages/${messageId}/filter`, { segment: segmentId })

export const getSegmentAudience = id => apiClient.get(`/v3/audience-segments/${id}`)
export const createSegmentAudience = data => apiClient.post('/v3/audience-segments', data)
export const updateSegmentAudience = (id, data) => apiClient.put(`/v3/audience-segments/${id}`, data)
