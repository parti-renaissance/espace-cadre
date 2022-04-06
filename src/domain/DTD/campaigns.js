import PropTypes from 'prop-types'

export class DTDCampaignItemScore {
  constructor(surveysCount, goal, visitedDoors, addressesCount, votersCount, pollingStationsCount, collectedContacts) {
    this.surveysCount = surveysCount
    this.goal = goal
    this.visitedDoors = visitedDoors
    this.addressesCount = addressesCount
    this.votersCount = votersCount
    this.pollingStationsCount = pollingStationsCount
    this.collectedContacts = collectedContacts
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
    visitedDoors: PropTypes.number.isRequired,
    addressesCount: PropTypes.number.isRequired,
    votersCount: PropTypes.number.isRequired,
    pollingStationsCount: PropTypes.number.isRequired,
    collectedContacts: PropTypes.number.isRequired,
  }
}

export class DTDCampaignItem {
  constructor(id, startDate, endDate, title, author, score) {
    this.id = id
    this.startDate = startDate
    this.endDate = endDate
    this.title = title
    this.author = author
    this.score = score
  }
  static propTypes = {
    id: PropTypes.string,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    score: PropTypes.shape(DTDCampaignItemScore.propTypes),
  }
}
