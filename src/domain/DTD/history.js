import PropTypes from 'prop-types'

export class DTDCampaignHistory {
  constructor(id, status, startDate, adherent, caller) {
    this.id = id
    this.status = status
    this.startDate = startDate
    this.adherent = adherent
    this.caller = caller
  }
}

export class DTDCampaignHistoryAdherent {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
}

export class DTDCampaignHistoryCaller {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

DTDCampaignHistory.propTypes = PropTypes.shape({
  status: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  adherent: DTDCampaignHistoryAdherent.propTypes,
  caller: DTDCampaignHistoryCaller.propTypes,
})

DTDCampaignHistoryAdherent.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
})

DTDCampaignHistoryCaller.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
})
