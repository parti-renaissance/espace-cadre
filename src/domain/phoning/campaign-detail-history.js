import PropTypes from 'prop-types'

export class PhoningCampaignDetailHistoryAdherent {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string,
    age: PropTypes.number,
  }
}

export class PhoningCampaignDetailHistoryCaller {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
  }
}

export class PhoningCampaignDetailHistory {
  constructor(id, status, adherent, caller, startDate) {
    this.id = id
    this.status = status
    this.adherent = adherent
    this.caller = caller
    this.startDate = startDate
  }
  static propTypes = {
    status: PropTypes.string.isRequired,
    adherent: PropTypes.shape(PhoningCampaignDetailHistoryAdherent.propTypes),
    caller: PropTypes.shape(PhoningCampaignDetailHistoryCaller.propTypes),
    startDate: PropTypes.object.isRequired,
  }
}
