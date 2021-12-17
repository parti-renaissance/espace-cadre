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

PhoningCampaignHistory.propTypes = {
  status: PropTypes.string.isRequired,
  startDate: PropTypes.object.isRequired,
  adherent: PhoningCampaignHistoryAdherent.propTypes,
  caller: PhoningCampaignHistoryCaller.propTypes,
  handleClick: PropTypes.func.isRequired,
}

PhoningCampaignHistoryAdherent.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
})

PhoningCampaignHistoryCaller.propTypes = PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
})
