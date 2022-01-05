import PropTypes from 'prop-types'

export class DTDCampaignDetailQuestioners {
  constructor(firstName, lastName, count) {
    this.firstName = firstName
    this.lastName = lastName
    this.count = count
  }
}

DTDCampaignDetailQuestioners.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}
