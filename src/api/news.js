import { apiClient } from 'services/networking/client'
import News from 'domain/news'
import { newPaginatedResult } from 'api/pagination'
import { parseDate } from 'shared/helpers'

export const getNewsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/jecoute/news?order[created_at]=desc&page=${page}&page_size=20`)

  const news = data.items.map(
    n =>
      new News(
        n.uuid,
        n.title,
        n.text,
        n.external_link,
        n.link_label,
        n.creator,
        parseDate(n.created_at),
        n.notification,
        n.published,
        n.pinned,
        n.zone?.uuid
      )
  )

  return newPaginatedResult(
    news.sort((a, b) => +b.createdAt - +a.createdAt),
    data.metadata
  )
}

export const updateNewsQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    uuid: news.id,
    title: news.title,
    text: news.body,
    created_at: news.createdAt,
    external_link: news.url,
    link_label: news.urlLabel,
    creator: news.creator,
    notification: news.withNotification,
    published: news.status,
    pinned: news.pinned,
    zone: news.zoneId,
    enriched: true,
  })

export const updateNewsPinnedStatusQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    published: news.status,
    pinned: news.pinned,
  })

export const createNewsQuery = news =>
  apiClient.post('api/v3/jecoute/news', {
    title: news.title,
    text: news.body,
    external_link: news.url,
    link_label: news.urlLabel,
    notification: news.withNotification,
    published: true,
    zone: news.zoneId,
    enriched: true,
  })
