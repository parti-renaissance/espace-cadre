import { apiClient, apiClientProxy } from 'services/networking/client'
import Message, { Statistics } from 'domain/message'
import { newPaginatedResult } from 'api/pagination'
import ReportRatio, { GeoRatio } from 'domain/reportRatio'

export const getMessages = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`/v3/adherent_messages?order[created_at]=desc&page=${page}&page_size=20`)

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

    const author = [message.author?.first_name, message.author?.last_name].filter(Boolean).join(' ')

    return new Message(message.uuid, author, message.status, message.subject, message.created_at, stats)
  })

  return newPaginatedResult(
    messages.sort((a, b) => +b.createdAt - +a.createdAt),
    data.metadata
  )
}
export const deleteMessage = id => apiClient.delete(`/v3/adherent_messages/${id}`)
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
export const updateSegmentAudience = audience => apiClient.put(`/v3/audience-segments/${audience.id}`, audience)

export const reportsRatio = async () => {
  const data = await apiClientProxy.get('/mailCampaign/reportsRatios')
  return new ReportRatio(
    new GeoRatio(data.local.nbCampagnes, data.local.txOuverture, data.local.txClique, data.local.txDesabonnement),
    new GeoRatio(
      data.national.nbCampagnes,
      data.national.txOuverture,
      data.national.txClique,
      data.national.txDesabonnement
    ),
    new Date(data.depuis)
  )
}
