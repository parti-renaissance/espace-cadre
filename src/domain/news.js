import PropTypes from 'prop-types'

export default class News {
  constructor(id, title, body, url, urlLabel, creator, createdAt, withNotification, status, zoneId, committeeUuid) {
    this.id = id
    this.title = title
    this.body = body
    this.url = url
    this.urlLabel = urlLabel
    this.creator = creator
    this.createdAt = createdAt
    this.withNotification = withNotification
    this.status = status
    this.zoneId = zoneId
    this.committeeUuid = committeeUuid
  }

  static NULL = new News(null, '', '', '', '', null, new Date(), false, false, null, null)

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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      this.zoneId,
      this.committeeUuid
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
      newZoneId,
      this.committeeUuid
    )
  }

  withCommitteeUuid(committeeUuid) {
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
      this.zoneId,
      committeeUuid
    )
  }
}

News.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string,
  urlLabel: PropTypes.string,
  creator: PropTypes.object,
  createdAt: PropTypes.object.isRequired,
  withNotification: PropTypes.bool,
  status: PropTypes.bool.isRequired,
  zoneId: PropTypes.string,
  committeeUuid: PropTypes.string,
})
