import { apiClient } from '../services/networking/client'
import News from '../domain/news'

export const getNewsQuery = async () => {
  const data = await apiClient.get('api/v3/jecoute/news')
  return data.items.map(
    n => new News(n.uuid, n.title, n.text, n.external_link, n.creator, n.created_at, n.notification, n.published)
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
  })

export const updateNewsStatusQuery = news =>
  apiClient.put(`api/v3/jecoute/news/${news.id}`, {
    published: news.status,
  })

export const createNewsQuery = news =>
  apiClient.post('api/v3/jecoute/news', {
    uuid: news.id,
    title: news.title,
    text: news.body,
    external_link: news.url,
    creator: news.creator,
    created_at: news.createdAt,
    notification: news.withNotification,
    published: news.status,
  })
