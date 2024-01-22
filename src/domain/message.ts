import PropTypes from 'prop-types'
import { parseDate } from '~/shared/helpers'

export class Statistics {
  static propTypes = {
    sent: PropTypes.number.isRequired,
    openings: PropTypes.number.isRequired,
    openingRate: PropTypes.number.isRequired,
    clicks: PropTypes.number.isRequired,
    clickRate: PropTypes.number.isRequired,
    unsubscribes: PropTypes.number.isRequired,
    unsubscribeRate: PropTypes.number.isRequired,
  }
  constructor(
    public sent: number,
    public openings: number,
    public openingRate: number,
    public clicks: number,
    public clickRate: number,
    public unsubscribes: number,
    public unsubscribeRate: number
  ) {}
}

export class Message {
  static propTypes = {
    sent: PropTypes.number.isRequired,
    openings: PropTypes.number.isRequired,
    openingRate: PropTypes.number.isRequired,
    clicks: PropTypes.number.isRequired,
    clickRate: PropTypes.number.isRequired,
    unsubscribes: PropTypes.number.isRequired,
    unsubscribeRate: PropTypes.number.isRequired,
  }
  public draft: boolean
  public createdAt: Date
  public sentAt: Date | null
  constructor(
    public id: string,
    public author: string,
    private status: 'sent' | 'draft',
    public subject: string,
    createdAt: string,
    public statistics: Statistics,
    sentAt: string | null,
    public isSynchronized: boolean,
    public previewLink?: string
  ) {
    this.draft = Boolean(this.status === 'draft')
    this.createdAt = parseDate(createdAt) as Date
    this.sentAt = (sentAt ? parseDate(sentAt) : null) as Date | null
  }
}

export default Message
