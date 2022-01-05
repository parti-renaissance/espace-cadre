import PropTypes from 'prop-types'

export class PhoningCampaignCallers {
  constructor(firstName, lastName, count) {
    this.firstName = firstName
    this.lastName = lastName
    this.count = count
  }
}

PhoningCampaignCallers.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}
