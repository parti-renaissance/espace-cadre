import PropTypes from 'prop-types'

export class Zone {
  constructor(id, name, code) {
    this.id = id
    this.name = name
    this.code = code
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
  }
}
