import PropTypes from 'prop-types'

export default class Riposte {
  constructor(
    id,
    title,
    body,
    url,
    withNotification,
    enabled,
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
    this.enabled = enabled
    this.createdAt = createdAt
    this.creator = creator
    this.views = views
    this.detailViews = detailViews
    this.sourceViews = sourceViews
    this.ripostes = ripostes
  }

  withTitle(newTitle) {
    return new Riposte(this.id, newTitle, this.body, this.url, this.withNotification, this.enabled, this.createdAt)
  }

  withBody(newBody) {
    return new Riposte(this.id, this.title, newBody, this.url, this.withNotification, this.enabled, this.createdAt)
  }

  withUrl(newUrl) {
    return new Riposte(this.id, this.title, this.body, newUrl, this.withNotification, this.enabled, this.createdAt)
  }

  withWithNotification(newWithNotification) {
    return new Riposte(this.id, this.title, this.body, this.url, newWithNotification, this.enabled, this.createdAt)
  }

  withEnabled(newEnabled) {
    return new Riposte(this.id, this.title, this.body, this.url, this.withNotification, newEnabled, this.createdAt)
  }

  toggleEnabled() {
    return new Riposte(this.id, this.title, this.body, this.url, this.withNotification, !this.enabled, this.createdAt)
  }

  static NULL() {
    return new Riposte(null, '', '', '', false, false, '')
  }
}

Riposte.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  withNotification: PropTypes.bool.isRequired,
  enabled: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  creator: PropTypes.string.isRequired,
  views: PropTypes.number.isRequired,
  detailViews: PropTypes.number.isRequired,
  sourceViews: PropTypes.number.isRequired,
  ripostes: PropTypes.number.isRequired,
})
