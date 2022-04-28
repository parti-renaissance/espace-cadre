import PropTypes from 'prop-types'

export class DTDLocalPollingStations {
  constructor(id, code, addresses, voters, isChecked = false) {
    this.id = id
    this.code = code
    this.addresses = addresses
    this.voters = voters
    this.isChecked = isChecked
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    addresses: PropTypes.number.isRequired,
    voters: PropTypes.number.isRequired,
  }
}
