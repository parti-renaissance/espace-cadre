import PropTypes from 'prop-types'
export class GlobalKpi {
  constructor(campaignCount, ongoingCampaigns, callsCount, lastMonthCallsCount, surveysCount, lastMonthSurveysCount) {
    this.campaignCount = campaignCount
    this.ongoingCampaigns = ongoingCampaigns
    this.callsCount = callsCount
    this.lastMonthCallsCount = lastMonthCallsCount
    this.surveysCount = surveysCount
    this.lastMonthSurveysCount = lastMonthSurveysCount
  }
}

export class PhoningCampaigns {
  constructor(id, title, goal, endTime, teamName, teamMembersCount, creator, callsCount, surveysCount) {
    this.id = id
    this.title = title
    this.goal = goal
    this.endTime = endTime
    this.teamName = teamName
    this.teamMembersCount = teamMembersCount
    this.creator = creator
    this.callsCount = callsCount
    this.surveysCount = surveysCount
  }
}

GlobalKpi.propTypes = {
  campaignCount: PropTypes.string,
  ongoingCampaigns: PropTypes.string,
  callsCount: PropTypes.string,
  lastMonthCallsCount: PropTypes.string,
  surveysCount: PropTypes.string,
  lastMonthSurveysCount: PropTypes.string,
}

PhoningCampaigns.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  goal: PropTypes.number.isRequired,
  endTime: PropTypes.instanceOf(Date).isRequired,
  teamName: PropTypes.string.isRequired,
  teamMembersCount: PropTypes.number.isRequired,
  creator: PropTypes.string.isRequired,
  callsCount: PropTypes.number.isRequired,
  surveysCount: PropTypes.number.isRequired,
}
