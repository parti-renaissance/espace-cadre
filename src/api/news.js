import { apiClient } from '~/services/networking/client'
import News from '~/domain/news'
import { newPaginatedResult } from '~/api/pagination'
import { parseDate } from '~/shared/helpers'

export const getNewsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/jecoute/news?order[created_at]=desc&page=${page}&page_size=20`)

  const news = data.items.map(
    n =>
      new News(
        n.uuid,
        n.title,
        n.content,
        n.external_link,
        n.link_label,
        n.author,
        parseDate(n.created_at),
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
    title: news.title,
    content: news.body,
    external_link: news.url,
    link_label: news.urlLabel,
    notification: news.withNotification,
    published: news.status,
  })

export const updateNewsStatusQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    published: news.status,
  })

export const createNewsQuery = news =>
  apiClient.post('api/v3/jecoute/news', {
    title: news.title,
    content: news.body,
    external_link: news.url,
    link_label: news.urlLabel,
    notification: true,
    published: true,
    zone: news.zoneId,
    committee: news.committeeUuid,
  })
