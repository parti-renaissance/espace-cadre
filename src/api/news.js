import { apiClient } from '../services/networking/client'
import News from '../domain/news'

export const getNews = async cb => {
  const data = await apiClient.get('api/v3/jecoute/news')
  const news = data.items.map(
    n => new News(n.uuid, n.title, n.text, n.external_link, n.creator, n.created_at, n.withNotification, n.published)
  )
  cb(news)
  return news
}

export const updateNews = news =>
  apiClient.put(`api/jecoute/news/${news.id}`, {
    uuid: news.id,
    title: news.title,
    text: news.body,
    external_link: news.url,
    creator: news.creator,
    created_at: news.createdAt,
    notification: news.withNotification,
    published: news.status,
  })

export const createNews = news =>
  apiClient.post('api/jecoute/news', {
    uuid: news.id,
    title: news.title,
    text: news.body,
    external_link: news.url,
    creator: news.creator,
    created_at: news.createdAt,
    notification: news.withNotification,
    published: news.status,
  })
