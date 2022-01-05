import PropTypes from 'prop-types'

export class DTDCampaignListItemScore {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
  }
}

export class DTDCampaignListItem {
  constructor(id, endDate, title, score) {
    this.id = id
    this.endDate = endDate
    this.title = title
    this.score = score
  }
  static propTypes = {
    id: PropTypes.string,
    endDate: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    score: PropTypes.shape(DTDCampaignListItemScore.propTypes),
  }
}
