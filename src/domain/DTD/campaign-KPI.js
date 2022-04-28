import PropTypes from 'prop-types'

export class DTDGlobalKPICampaigns {
  constructor(count, ongoing) {
    this.count = count
    this.ongoing = ongoing
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    ongoing: PropTypes.string.isRequired,
  }
}

export class DTDGlobalKPISurveys {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    onAMonth: PropTypes.string.isRequired,
  }
}

export class DTDGlobalKPIDoors {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
  static propTypes = {
    count: PropTypes.string.isRequired,
    onAMonth: PropTypes.string.isRequired,
  }
}

export class DTDGlobalKPI {
  constructor(campaigns, surveys, calls) {
    this.campaigns = campaigns
    this.surveys = surveys
    this.calls = calls
  }
  static propTypes = {
    campaigns: PropTypes.shape(DTDGlobalKPICampaigns.propTypes),
    surveys: PropTypes.shape(DTDGlobalKPISurveys.propTypes),
    doors: PropTypes.shape(DTDGlobalKPIDoors.propTypes),
  }
}
