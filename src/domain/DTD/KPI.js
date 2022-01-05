import PropTypes from 'prop-types'

export class DTDGlobalKPI {
  constructor(campaigns, surveys, calls) {
    this.campaigns = campaigns
    this.surveys = surveys
    this.calls = calls
  }
}

export class DTDCampaignsKPI {
  constructor(count, ongoing) {
    this.count = count
    this.ongoing = ongoing
  }
}

export class DTDSurveysKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}

export class DTDCallsKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}

DTDCampaignsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  ongoing: PropTypes.string.isRequired,
}

DTDSurveysKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

DTDCallsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

DTDGlobalKPI.propTypes = {
  campaigns: DTDCampaignsKPI.propTypes,
  surveys: DTDSurveysKPI.propTypes,
  calls: DTDCallsKPI.propTypes,
}
