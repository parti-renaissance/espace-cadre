import PropTypes from 'prop-types'

export default class GlobalKpi {
  constructor(campaignCount, ongoingCampaigns, callsCount, lastMonthCallsCount, surveysCount, lastMonthSurveysCount) {
    this.campaignCount = campaignCount
    this.ongoingCampaigns = ongoingCampaigns
    this.callsCount = callsCount
    this.lastMonthCallsCount = lastMonthCallsCount
    this.surveysCount = surveysCount
    this.lastMonthSurveysCount = lastMonthSurveysCount
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
