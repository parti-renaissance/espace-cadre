import PropTypes from 'prop-types'

export class Adherent {
  constructor(firstName, lastName, gender, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.age = age
  }
}

export class Caller {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
}

export default class PhoningCampaignHistory {
  constructor(id, status, startDate, adherent, caller) {
    this.id = id
    this.status = status
    this.startDate = startDate
    this.adherent = adherent
    this.caller = caller
  }
}

PhoningCampaignHistory.propTypes = {
  status: PropTypes.string.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  adherent: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
  }),
  caller: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }),
  handleClick: PropTypes.func.isRequired,
}
