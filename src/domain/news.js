import PropTypes from 'prop-types'
export default class News {
  constructor(id, title, body, url, creator, createdAt, withNotification, status) {
    this.id = id
    this.title = title
    this.body = body
    this.url = url
    this.creator = creator
    this.createdAt = createdAt
    this.withNotification = withNotification
    this.status = status
  }

  static NULL = new News(null, '', '', '', '', '', false, false)

  withTitle(newTitle) {
    return new News(
      this.id,
      newTitle,
      this.body,
      this.url,
      this.creator,
      this.createdAt,
      this.withNotification,
      this.status
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
      this.status
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
      this.status
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
      this.status
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
      newStatus
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
      !this.status
    )
  }
}

News.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  url: PropTypes.string,
  creator: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
  withNotification: PropTypes.bool,
  status: PropTypes.bool.isRequired,
})
