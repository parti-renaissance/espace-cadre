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

export default class PhoningCampaignCallers {
  constructor(firstName, lastName, count) {
    this.firstName = firstName
    this.lastName = lastName
    this.count = count
  }
}

PhoningCampaignCallers.propTypes = {
  number: PropTypes.number.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
}
