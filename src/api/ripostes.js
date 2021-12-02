import { apiClient } from '../services/networking/client'
import Riposte from '../domain/riposte'

export const getRipostesQuery = async () => {
  const data = await apiClient.get('api/v3/ripostes')
  return data.map(
    r =>
      new Riposte(
        r.uuid,
        r.title,
        r.body,
        r.source_url,
        r.with_notification,
        r.enabled,
        r.creator,
        r.created_at,
        r.nb_views,
        r.nb_detail_views,
        r.nb_source_views,
        r.nb_ripostes
      )
  )
}

export const updateRiposteQuery = riposte =>
  apiClient.put(`api/v3/ripostes/${riposte.id}`, {
    uuid: riposte.id,
    title: riposte.title,
    body: riposte.body,
    source_url: riposte.url,
    with_notification: riposte.withNotification,
    enabled: riposte.status,
    creator: riposte.creator,
    created_at: riposte.createdAt,
    nb_views: riposte.views,
    nb_detail_views: riposte.detailViews,
    nb_source_views: riposte.sourceViews,
    nb_ripostes: riposte.riposte,
  })

export const updateRiposteStatusQuery = riposte =>
  apiClient.put(`api/v3/ripostes/${riposte.id}`, {
    enabled: riposte.status,
  })

export const createRiposteQuery = riposte =>
  apiClient.post('api/v3/ripostes', {
    uuid: riposte.id,
    title: riposte.title,
    body: riposte.body,
    source_url: riposte.url,
    with_notification: riposte.withNotification,
    enabled: riposte.status,
    creator: riposte.creator,
    created_at: riposte.createdAt,
    nb_views: riposte.views,
    nb_detail_views: riposte.detailViews,
    nb_source_views: riposte.sourceViews,
    nb_ripostes: riposte.riposte,
  })
