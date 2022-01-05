import PropTypes from 'prop-types'

export class PhoningGlobalKPI {
  constructor(campaigns, surveys, calls) {
    this.campaigns = campaigns
    this.surveys = surveys
    this.calls = calls
  }
}

export class PhoningCampaignsKPI {
  constructor(count, ongoing) {
    this.count = count
    this.ongoing = ongoing
  }
}

export class PhoningSurveysKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}

export class PhoningCallsKPI {
  constructor(count, onAMonth) {
    this.count = count
    this.onAMonth = onAMonth
  }
}

PhoningCampaignsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  ongoing: PropTypes.string.isRequired,
}

PhoningSurveysKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

PhoningCallsKPI.propTypes = {
  count: PropTypes.string.isRequired,
  onAMonth: PropTypes.string.isRequired,
}

PhoningGlobalKPI.propTypes = {
  campaigns: PhoningCampaignsKPI.propTypes,
  surveys: PhoningSurveysKPI.propTypes,
  calls: PhoningCallsKPI.propTypes,
}
