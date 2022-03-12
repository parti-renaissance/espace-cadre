import { apiClient } from 'services/networking/client'
import News from 'domain/news'
import { newPaginatedResult } from 'api/pagination'

export const getNewsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/jecoute/news?order[created_at]=desc&page=${page}&page_size=20`)

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
    published: true,
    zone: news.zoneId,
  })
