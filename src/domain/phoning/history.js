import PropTypes from 'prop-types'

export class PhoningCampaignHistory {
  constructor(id, status, startDate, adherent, caller) {
    this.id = id
    this.status = status
    this.startDate = startDate
    this.adherent = adherent
    this.caller = caller
  }
}

export class PhoningCampaignHistoryAdherent {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
}

export class PhoningCampaignHistoryCaller {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

PhoningCampaignHistory.propTypes = PropTypes.shape({
  status: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  adherent: PhoningCampaignHistoryAdherent.propTypes,
  caller: PhoningCampaignHistoryCaller.propTypes,
})

// TODO: add '.isRequired' when data will be properly sent by API
PhoningCampaignHistoryAdherent.propTypes = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  age: PropTypes.number,
})

PhoningCampaignHistoryCaller.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
})
