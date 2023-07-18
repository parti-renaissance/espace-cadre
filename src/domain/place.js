import PropTypes from 'prop-types'

export class Place {
  constructor(number, route, postalCode, locality, country) {
    this.number = number
    this.route = route
    this.postalCode = postalCode
    this.locality = locality
    this.country = country
  }

  static NULL = new Place('', '', '', '', '')

  getAddress() {
    return [this.number, this.route].filter(Boolean).join(' ')
  }

  isEmpty() {
    return !(this.number + this.route + this.postalCode + this.locality + this.country)
  }
}

Place.propTypes = PropTypes.shape({
  number: PropTypes.string,
  route: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  locality: PropTypes.string,
  country: PropTypes.string.isRequired,
})
