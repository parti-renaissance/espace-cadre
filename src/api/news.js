import { apiClient } from 'services/networking/client'
import News from 'domain/news'
import { PaginatedResult } from 'api/pagination'

export const getNewsQuery = async ({ pageParam = 1 }) => {
  const data = await apiClient.get(`api/v3/jecoute/news?order[created_at]=desc&page=${pageParam}&page_size=20`)

  const news = data.items.map(
    n =>
      new News(
        n.uuid,
        n.title,
        n.text,
        n.external_link,
        n.creator,
        new Date(n.created_at),
        n.notification,
        n.published,
        n.zone?.uuid
      )
  )

  return new PaginatedResult(
    news.sort((a, b) => +b.createdAt - +a.createdAt),
    data.metadata.total_items,
    data.metadata.items_per_page,
    data.metadata.count,
    data.metadata.current_page,
    data.metadata.last_page
  )
}

export const updateNewsQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    uuid: news.id,
    title: news.title,
    text: news.body,
    created_at: news.createdAt,
    external_link: news.url,
    creator: news.creator,
    notification: news.withNotification,
    published: news.status,
    zone: news.zoneId,
  })

export const updateNewsStatusQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    published: news.status,
  })

export const createNewsQuery = news =>
  apiClient.post('api/v3/jecoute/news', {
    title: news.title,
    text: news.body,
    external_link: news.url,
    notification: news.withNotification,
    published: news.status,
    zone: news.zoneId,
  })
