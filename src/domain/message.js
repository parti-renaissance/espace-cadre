import PropTypes from 'prop-types'
import { parseDate } from 'shared/helpers'

export class Statistics {
  constructor(sent, openings, openingRate, clicks, clickRate, unsubscribes, unsubscribeRate) {
    this.sent = sent
    this.openings = openings
    this.openingRate = openingRate
    this.clicks = clicks
    this.clickRate = clickRate
    this.unsubscribes = unsubscribes
    this.unsubscribeRate = unsubscribeRate
  }
}

Statistics.propTypes = PropTypes.shape({
  sent: PropTypes.number.isRequired,
  openings: PropTypes.number.isRequired,
  openingRate: PropTypes.number.isRequired,
  clicks: PropTypes.number.isRequired,
  clickRate: PropTypes.number.isRequired,
  unsubscribes: PropTypes.number.isRequired,
  unsubscribeRate: PropTypes.number.isRequired,
})

class Message {
  constructor(id, author, status, subject, createdAt, statistics, sentAt, isSynchronized, previewLink) {
    this.id = id
    this.author = author
    this.draft = status === 'draft'
    this.subject = subject
    this.createdAt = parseDate(createdAt)
    this.statistics = statistics
    this.sentAt = sentAt ? parseDate(sentAt) : null
    this.isSynchronized = isSynchronized
    this.previewLink = previewLink
  }
}

Message.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  draft: PropTypes.bool.isRequired,
  subject: PropTypes.string.isRequired,
  createdAt: PropTypes.object.isRequired,
  isSynchronized: PropTypes.bool.isRequired,
  previewLink: PropTypes.string,
  statistics: Statistics.propTypes.isRequired,
})

export default Message
