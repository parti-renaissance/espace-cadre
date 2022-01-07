import PropTypes from 'prop-types'

export class DTDCampaignDetailKPIRemaining {
  constructor(startDate, endDate) {
    this.startDate = startDate
    this.endDate = endDate
  }
  static propTypes = {
    startDate: PropTypes.object, // TODO after MEP (6.01.2022) -> has to be isRequired
    endDate: PropTypes.object.isRequired,
  }
}

export class DTDCampaignDetailKPISurveys {
  constructor(count) {
    this.count = count
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPIDoors {
  constructor(count) {
    this.count = count
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPIContacts {
  constructor(count) {
    this.count = count
  }
  static propTypes = {
    count: PropTypes.number.isRequired,
  }
}

export class DTDCampaignDetailKPI {
  constructor(remaining, surveys, doors, contacts) {
    this.remaining = remaining
    this.surveys = surveys
    this.doors = doors
    this.contacts = contacts
  }
  static propTypes = {
    remaining: PropTypes.shape(DTDCampaignDetailKPIRemaining.propTypes),
    surveys: PropTypes.shape(DTDCampaignDetailKPISurveys.propTypes),
    doors: PropTypes.shape(DTDCampaignDetailKPIDoors.propTypes),
    contacts: PropTypes.shape(DTDCampaignDetailKPIContacts.propTypes),
  }
}
