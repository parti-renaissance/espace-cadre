import { apiClient } from '~/services/networking/client'
import Message, { CreateMessageContent, Statistics } from '~/domain/message'
import { PaginatedResult, newPaginatedResult } from '~/api/pagination'
import ReportRatio, { GeoRatio } from '~/domain/reportRatio'
import { parseDate } from '~/shared/helpers'
import qs from 'qs'

interface Data {
  items: {
    uuid: string
    author: {
      first_name: string
      last_name: string
    }
    status: 'draft' | 'sent'
    subject: string
    label: string
    created_at: string
    sent_at: string
    synchronized: boolean
    recipient_count: number
    preview_link: string
    statistics?: {
      sent: number
      opens: number
      open_rate: number
      clicks: number
      click_rate: number
      unsubscribe: number
      unsubscribe_rate: number
    }
  }[]
  metadata: Parameters<typeof newPaginatedResult>[1]
}

const isMessageArray = (data: unknown): data is Data['items'] =>
  Array.isArray(data) && data.every(item => 'uuid' in item)

const isPaginatedData = (data: unknown): data is Data =>
  typeof data === 'object' && data !== null && 'items' in data && isMessageArray(data.items)

type DataMessage = Data['items'][0]

const parseDataMessage = (data: DataMessage) => {
  const { uuid, status, subject, label, created_at, sent_at, preview_link, synchronized, recipient_count } = data
  let statistics: Statistics | undefined = undefined
  if (data.statistics) {
    const { sent, opens, open_rate, clicks, click_rate, unsubscribe, unsubscribe_rate } = data.statistics
    statistics = new Statistics(sent, opens, open_rate, clicks, click_rate, unsubscribe, unsubscribe_rate)
  }
  const author = [data.author?.first_name, data.author?.last_name].filter(Boolean).join(' ')
  return new Message(
    uuid,
    author,
    status,
    subject,
    label,
    created_at,
    statistics,
    sent_at,
    synchronized,
    preview_link,
    recipient_count
  )
}

type GetMessagesParams = {
  page?: number
  statutory?: boolean
  page_size?: number
  status?: string
  pagination?: boolean
  label?: string
}
export async function getMessages(params: GetMessagesParams & { pagination: false }): Promise<Message[]>
export async function getMessages(params: GetMessagesParams & { pagination?: true }): Promise<PaginatedResult<Message>>
export async function getMessages(params: GetMessagesParams) {
  const parsedParams = {
    ...params,
    statutory: params.statutory ? 1 : undefined,
  }
  const data = await apiClient.get(`/v3/adherent_messages?order[created_at]=desc&${qs.stringify(parsedParams)}`)

  if (typeof params.pagination !== 'undefined' && !params.pagination) {
    return data.map(parseDataMessage)
  }

  return newPaginatedResult<Message>(
    data.items.map(parseDataMessage).sort((a: Message, b: Message) => +b.createdAt - +a.createdAt),
    data.metadata
  )
}

/**
 * @param {string} id
 * @returns void
 */
export const deleteMessage = (id: string) => apiClient.delete(`/v3/adherent_messages/${id}`)
export const duplicateMessage = (id: string) => apiClient.post(`/v3/adherent_messages/${id}/duplicate`)
export const messageSynchronizationStatus = async (id: string) => {
  const data = await apiClient.get(`/v3/adherent_messages/${id}`)
  return { isSynchronized: data.synchronized as boolean } as const
}
export const getMessageContent = (id: string) => apiClient.get(`/v3/adherent_messages/${id}/content`)
export const getMessage = (id: string) => apiClient.get(`/v3/adherent_messages/${id}`).then(parseDataMessage)
export const updateMessageFilter = ({ id, data }) => apiClient.put(`/v3/adherent_messages/${id}/filter`, data)
export const createMessageContent = data => apiClient.post('/v3/adherent_messages', data)
export const updateMessageContent = (id: string, data: CreateMessageContent) =>
  apiClient.put(`/v3/adherent_messages/${id}`, data)
export const sendMessage = (id: string) => apiClient.post(`/v3/adherent_messages/${id}/send`)
export const sendTestMessage = (id: string) => apiClient.post(`/v3/adherent_messages/${id}/send-test`)

export const reportsRatio = async (): Promise<ReportRatio> => {
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
    parseDate(data.since)
  )
}
export const getTemplates = async (isMailsStatutory: boolean) => {
  const query = isMailsStatutory ? '?statutory=1' : ''
  return await apiClient.get(`/v3/email_templates${query}`)
}
export const getTemplate = async (uuid: string) => await apiClient.get(`/v3/email_templates/${uuid}`)
