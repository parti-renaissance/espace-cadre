import PropTypes from 'prop-types'

export default class Riposte {
  constructor(
    id,
    title,
    body,
    url,
    withNotification,
    status,
    createdAt,
    creator,
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
    this.createdAt = createdAt
    this.creator = creator
    this.views = views
    this.detailViews = detailViews
    this.sourceViews = sourceViews
    this.ripostes = ripostes
  }

  static NULL = new Riposte(null, '', '', '', false, false, '', '', 0, 0, 0, 0)

  withTitle(newTitle) {
    return new Riposte(this.id, newTitle, this.body, this.url, this.withNotification, this.status, this.createdAt)
  }

  withBody(newBody) {
    return new Riposte(this.id, this.title, newBody, this.url, this.withNotification, this.status, this.createdAt)
  }

  withUrl(newUrl) {
    return new Riposte(this.id, this.title, this.body, newUrl, this.withNotification, this.status, this.createdAt)
  }

  withWithNotification(newWithNotification) {
    return new Riposte(this.id, this.title, this.body, this.url, newWithNotification, this.status, this.createdAt)
  }

  withStatus(newStatus) {
    return new Riposte(this.id, this.title, this.body, this.url, this.withNotification, newStatus, this.createdAt)
  }

  toggleStatus() {
    return new Riposte(this.id, this.title, this.body, this.url, this.withNotification, !this.status, this.createdAt)
  }
}

Riposte.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  withNotification: PropTypes.bool.isRequired,
  status: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  detailViews: PropTypes.number.isRequired,
  sourceViews: PropTypes.number.isRequired,
  ripostes: PropTypes.number.isRequired,
})
