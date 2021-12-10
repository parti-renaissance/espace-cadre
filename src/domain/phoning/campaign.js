import PropTypes from 'prop-types'

export class PhoningCampaign {
  constructor(id, title, startDate, endDate, calls, surveys, averageTime, goalPerCaller) {
    this.id = id
    this.title = title
    this.startDate = startDate
    this.surveys = surveys
    this.endDate = endDate
    this.calls = calls
    this.averageTime = averageTime
    this.goalPerCaller = goalPerCaller
  }
}

export class PhoningCampaignCalls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
}

export class PhoningCampaignSurveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

PhoningCampaign.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  endDate: PropTypes.object.isRequired,
  surveys: PhoningCampaignSurveys.propTypes,
  calls: PhoningCampaignCalls.propTypes,
  averageTime: PropTypes.string.isRequired,
  goalPerCaller: PropTypes.string.isRequired,
})

PhoningCampaignCalls.propTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  toRemind: PropTypes.number.isRequired,
})

PhoningCampaignSurveys.propTypes = PropTypes.shape({
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
})
