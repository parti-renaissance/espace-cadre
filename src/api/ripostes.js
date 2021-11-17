import { apiClient } from '../services/networking/client'
import Riposte from '../domain/riposte'

export const getRipostes = async cb => {
  const data = await apiClient.get('api/v3/ripostes')
  const ripostes = data.map(
    r =>
      new Riposte(
        r.uuid,
        r.title,
        r.body,
        r.source_url,
        r.with_notification,
        r.enabled,
        r.created_at,
        r.creator,
        r.nb_views,
        r.nb_detail_views,
        r.nb_source_views,
        r.nb_ripostes
      )
  )
  cb(ripostes)
  return ripostes
}

export const updateRiposte = riposte =>
  apiClient.put(`api/v3/ripostes/${riposte.id}`, {
    uuid: riposte.id,
    title: riposte.title,
    body: riposte.body,
    source_url: riposte.url,
    with_notification: riposte.withNotification,
    enabled: riposte.status,
    created_at: riposte.createdAt,
    creator: riposte.creator,
    nb_views: riposte.views,
    nb_detail_views: riposte.detailViews,
    nb_source_views: riposte.sourceViews,
    nb_ripostes: riposte.riposte,
  })

export const createRiposte = riposte =>
  apiClient.post('api/v3/ripostes', {
    uuid: riposte.id,
    title: riposte.title,
    body: riposte.body,
    source_url: riposte.url,
    with_notification: riposte.withNotification,
    enabled: riposte.status,
    created_at: riposte.createdAt,
    creator: riposte.creator,
    nb_views: riposte.views,
    nb_detail_views: riposte.detailViews,
    nb_source_views: riposte.sourceViews,
    nb_ripostes: riposte.riposte,
  })
