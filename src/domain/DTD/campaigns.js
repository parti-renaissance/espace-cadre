import PropTypes from 'prop-types'

export class DTDCampaign {
  constructor(title, goal, startDate, endDate, survey, brief, votePlaces) {
    this.title = title
    this.goal = goal
    this.startDate = startDate
    this.endDate = endDate
    this.survey = survey
    this.brief = brief
    this.votePlaces = votePlaces
  }

  static NULL = new DTDCampaign('', '', null, null, '', '', [])
}

DTDCampaign.propTypes = {
  title: PropTypes.string.isRequired,
  goal: PropTypes.number.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  survey: PropTypes.string.isRequired,
  brief: PropTypes.string.isRequired,
  votePlaces: PropTypes.array.isRequired,
}

export class DTDCampaignItemScore {
  constructor(count, goal, knockedDoors, addresses, voters, pollingStations, collectedContacts) {
    this.count = count
    this.goal = goal
    this.knockedDoors = knockedDoors
    this.addresses = addresses
    this.voters = voters
    this.pollingStations = pollingStations
    this.collectedContacts = collectedContacts
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
    knockedDoors: PropTypes.number.isRequired,
    addresses: PropTypes.number.isRequired,
    voters: PropTypes.number.isRequired,
    pollingStations: PropTypes.number.isRequired,
    collectedContacts: PropTypes.number.isRequired,
  }
}

export class DTDCampaignItem {
  constructor(id, author, startDate, endDate, title, score) {
    this.id = id
    this.author = author
    this.startDate = startDate
    this.endDate = endDate
    this.title = title
    this.score = score
  }
  static propTypes = {
    id: PropTypes.string,
    author: PropTypes.string.isRequired,
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    score: PropTypes.shape(DTDCampaignItemScore.propTypes),
  }
}
