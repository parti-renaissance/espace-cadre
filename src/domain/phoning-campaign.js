import PropTypes from 'prop-types'

export class Surveys {
  constructor(count, goal) {
    this.count = count
    this.goal = goal
  }
}

export class Calls {
  constructor(count, toRemind) {
    this.count = count
    this.toRemind = toRemind
  }
}

export default class PhoningCampaign {
  constructor(title, startDate, endDate, surveys, calls, averageTime, goalPerCaller) {
    this.title = title
    this.startDate = startDate
    this.endDate = endDate
    this.surveys = surveys
    this.calls = calls
    this.averageTime = averageTime
    this.goalPerCaller = goalPerCaller
  }
}

PhoningCampaign.propTypes = PropTypes.shape({
  startDate: PropTypes.instanceOf(Date).isRequired,
  surveys: PropTypes.shape({
    count: PropTypes.number.isRequired,
    goal: PropTypes.number.isRequired,
  }),
  calls: PropTypes.shape({
    count: PropTypes.number.isRequired,
    toRemind: PropTypes.number.isRequired,
  }),
  averageTime: PropTypes.string.isRequired,
})
