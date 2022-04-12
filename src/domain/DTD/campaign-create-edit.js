import PropTypes from 'prop-types'

export class DTDCampaignCreateEdit {
  constructor(title, goal, startDate, endDate, survey, brief, votePlaces) {
    this.title = title
    this.goal = goal
    this.startDate = startDate
    this.endDate = endDate
    this.survey = survey
    this.brief = brief
    this.votePlaces = votePlaces
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    goal: PropTypes.number.isRequired,
    startDate: PropTypes.instanceOf(Date).isRequired,
    endDate: PropTypes.instanceOf(Date).isRequired,
    survey: PropTypes.string.isRequired,
    brief: PropTypes.string.isRequired,
    votePlaces: PropTypes.array.isRequired,
  }
}
