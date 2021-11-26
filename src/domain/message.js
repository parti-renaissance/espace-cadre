export class Statistics {
  constructor(sent, opens, openRate, clicks, clickRate, unsubscribes, unsubscribeRate) {
    this.sent = sent
    this.opens = opens
    this.openRate = openRate
    this.clicks = clicks
    this.clickRate = clickRate
    this.unsubscribes = unsubscribes
    this.unsubscribeRate = unsubscribeRate
  }
}

class Message {
  constructor(id, author, status, subject, date, statistics) {
    this.id = id
    this.author = author
    this.status = status
    this.subject = subject
    this.date = date
    this.statistics = statistics
  }
}

export default Message
