import PropTypes from 'prop-types'
export default class News {
  constructor(id, title, body, url, creator, createdAt, withNotification, status, zoneId) {
    this.id = id
    this.title = title
    this.body = body
    this.url = url
    this.creator = creator
    this.createdAt = createdAt
    this.withNotification = withNotification
    this.status = status
    this.zoneId = zoneId
  }

  static NULL = new News(null, '', '', '', '', '', false, false, '')

  withTitle(newTitle) {
    return new News(
      this.id,
      newTitle,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.zoneId
    )
  }

  withBody(newBody) {
    return new News(
      this.id,
      this.title,
      newBody,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.zoneId
    )
  }

  withUrl(newUrl) {
    return new News(
      this.id,
      this.title,
      this.body,
      newUrl,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      this.zoneId
    )
  }

  withWithNotification(newWithNotification) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      newWithNotification,
      this.status,
      this.zoneId
    )
  }

  withStatus(newStatus) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      newStatus,
      this.zoneId
    )
  }

  toggleStatus() {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      !this.status,
      this.zoneId
    )
  }

  withZoneId(newZoneId) {
    return new News(
      this.id,
      this.title,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status,
      newZoneId
    )
  }
}

News.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string,
  creator: PropTypes.string,
  createdAt: PropTypes.object.isRequired,
  withNotification: PropTypes.bool,
  status: PropTypes.bool.isRequired,
  zoneId: PropTypes.string,
})
