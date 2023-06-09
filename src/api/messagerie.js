import { apiClient } from 'services/networking/client'
import Message, { Statistics } from 'domain/message'
import { newPaginatedResult } from 'api/pagination'
import ReportRatio, { GeoRatio } from 'domain/reportRatio'

export const getMessages = async ({ page, isMailsStatutory }) => {
  const query = isMailsStatutory ? 'statutory=1' : ''
  const data = await apiClient.get(`/v3/adherent_messages?order[created_at]=desc&page=${page}&page_size=20&${query}`)

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
export const getMessage = id => apiClient.get(`/v3/adherent_messages/${id}`)
export const updateMessageFilter = ({ id, data }) => apiClient.put(`/v3/adherent_messages/${id}/filter`, data)
export const createMessageContent = data => apiClient.post('/v3/adherent_messages', data)
export const updateMessageContent = (id, data) => apiClient.put(`/v3/adherent_messages/${id}`, data)
export const sendMessage = id => apiClient.post(`/v3/adherent_messages/${id}/send`)
export const sendTestMessage = id => apiClient.post(`/v3/adherent_messages/${id}/send-test`)

export const reportsRatio = async () => {
  const data = await apiClient.get('/v3/adherent_messages/kpi')
  return new ReportRatio(
    new GeoRatio(
      data.local.nb_campaigns,
      data.local.opened_rate,
      data.local.clicked_rate,
      data.local.unsubscribed_rate
    ),
    new GeoRatio(
      data.national.nb_campaigns,
      data.national.opened_rate,
      data.national.clicked_rate,
      data.national.unsubscribed_rate
    ),
    new Date(data.since)
  )
}
export const getTemplates = async isMailsStatutory => {
  const query = isMailsStatutory ? '?statutory=1' : ''
  return await apiClient.get(`/v3/email_templates${query}`)
}
export const getTemplate = async uuid => await apiClient.get(`/v3/email_templates/${uuid}`)
