import PropTypes from 'prop-types'

export class PhoningCampaignDetailKPIRemaining {
  constructor(startDate, endDate) {
    this.startDate = startDate
    this.endDate = endDate
  }
  static propTypes = {
    startDate: PropTypes.object.isRequired,
    endDate: PropTypes.object.isRequired,
  }
}

export class PhoningCampaignDetailKPISurveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignDetailKPICalls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
    toRemind: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignDetailKPI {
  constructor(remaining, surveys, calls, averageTime) {
    this.remaining = remaining
    this.surveys = surveys
    this.calls = calls
    this.averageTime = averageTime
  }
  static propTypes = {
    remaining: PropTypes.shape(PhoningCampaignDetailKPIRemaining.propTypes),
    surveys: PropTypes.shape(PhoningCampaignDetailKPISurveys.propTypes),
    calls: PropTypes.shape(PhoningCampaignDetailKPICalls.propTypes),
    averageTime: PropTypes.number.isRequired,
  }
}
