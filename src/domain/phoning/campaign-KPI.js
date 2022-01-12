import PropTypes from 'prop-types'

export class PhoningGlobalKPICampaigns {
  constructor(count, ongoing) {
    this.count = count
    this.ongoing = ongoing
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    ongoing: PropTypes.string.isRequired,
  }
}

export class PhoningGlobalKPISurveys {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    onAMonth: PropTypes.string.isRequired,
  }
}

export class PhoningGlobalKPICalls {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    onAMonth: PropTypes.string.isRequired,
  }
}

export class PhoningGlobalKPI {
  constructor(campaigns, surveys, calls) {
    this.campaigns = campaigns
    this.surveys = surveys
    this.calls = calls
  }
  static propTypes = {
    campaigns: PropTypes.shape(PhoningGlobalKPICampaigns.propTypes),
    surveys: PropTypes.shape(PhoningGlobalKPISurveys.propTypes),
    calls: PropTypes.shape(PhoningGlobalKPICalls.propTypes),
  }
}
