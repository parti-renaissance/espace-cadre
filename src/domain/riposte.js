import PropTypes from 'prop-types'
import { parseDate } from 'shared/helpers'

export default class Riposte {
  constructor(
    id,
    title,
    body,
    url,
    withNotification,
    status,
    creator,
    createdAt,
    views,
    detailViews,
    sourceViews,
    ripostes
  ) {
    this.id = id
    this.title = title
    this.body = body
    this.url = url
    this.withNotification = withNotification
    this.status = status
    this.creator = creator
    this.createdAt = parseDate(createdAt)
    this.views = views
    this.detailViews = detailViews
    this.sourceViews = sourceViews
    this.ripostes = ripostes
  }

  static NULL = new Riposte(null, '', '', '', false, false, '', '', 0, 0, 0, 0)

  withTitle(newTitle) {
    return new Riposte(
      this.id,
      newTitle,
      this.body,
      this.url,
      this.withNotification,
      this.status,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }

  withBody(newBody) {
    return new Riposte(
      this.id,
      this.title,
      newBody,
      this.url,
      this.withNotification,
      this.status,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }

  withUrl(newUrl) {
    return new Riposte(
      this.id,
      this.title,
      this.body,
      newUrl,
      this.withNotification,
      this.status,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }

  withWithNotification(newWithNotification) {
    return new Riposte(
      this.id,
      this.title,
      this.body,
      this.url,
      newWithNotification,
      this.status,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }

  withStatus(newStatus) {
    return new Riposte(
      this.id,
      this.title,
      this.body,
      this.url,
      this.withNotification,
      newStatus,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }

  toggleStatus() {
    return new Riposte(
      this.id,
      this.title,
      this.body,
      this.url,
      this.withNotification,
      !this.status,
      this.creator,
      this.createdAt,
      this.views,
      this.detailViews,
      this.sourceViews,
      this.ripostes
    )
  }
}

Riposte.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  withNotification: PropTypes.bool.isRequired,
  status: PropTypes.bool.isRequired,
  creator: PropTypes.string.isRequired,
  createdAt: PropTypes.object.isRequired,
  views: PropTypes.number.isRequired,
  detailViews: PropTypes.number.isRequired,
  sourceViews: PropTypes.number.isRequired,
  ripostes: PropTypes.number.isRequired,
})
