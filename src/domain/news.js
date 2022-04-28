import PropTypes from 'prop-types'
export default class News {
  constructor(id, title, body, url, urlLabel, creator, createdAt, withNotification, status, pinned, zoneId) {
    this.id = id
    this.title = title
    this.body = body
    this.url = url
    this.urlLabel = urlLabel
    this.creator = creator
    this.createdAt = createdAt
    this.withNotification = withNotification
    this.status = status
    this.pinned = pinned
    this.zoneId = zoneId
  }

  static NULL = new News(null, '', '', '', '', '', new Date(), false, false, false, '')

  withTitle(newTitle) {
    return new News(
      this.id,
      newTitle,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.pinned,
      this.zoneId
    )
  }

  withBody(newBody) {
    return new News(
      this.id,
      this.title,
      newBody,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.pinned,
      this.zoneId
    )
  }

  withUrl(newUrl) {
    return new News(
      this.id,
      this.title,
      this.body,
      newUrl,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.pinned,
      this.zoneId
    )
  }

  withUrlLabel(newUrlLabel) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      newUrlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.pinned,
      this.zoneId
    )
  }

  withWithNotification(newWithNotification) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      newWithNotification,
      this.status,
      this.pinned,
      this.zoneId
    )
  }

  withStatus(newStatus) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      newStatus,
      this.pinned,
      this.zoneId
    )
  }

  withPinned(newPinned) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      newPinned,
      this.zoneId
    )
  }

  toggleStatus() {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      !this.status,
      this.pinned,
      this.zoneId
    )
  }

  togglePinned() {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      !this.pinned,
      this.zoneId
    )
  }

  withZoneId(newZoneId) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.urlLabel,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.pinned,
      newZoneId
    )
  }
}

News.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string,
  urlLabel: PropTypes.string,
  creator: PropTypes.string,
  createdAt: PropTypes.object.isRequired,
  withNotification: PropTypes.bool,
  status: PropTypes.bool.isRequired,
  pinned: PropTypes.bool.isRequired,
  zoneId: PropTypes.string,
})
