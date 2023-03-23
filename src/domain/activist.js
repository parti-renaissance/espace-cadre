import PropTypes from 'prop-types'

export default class Activist {
  constructor(firstname, lastname, gender, country, cityId, city, postalCode, interests, emailSubscription, raw) {
    this.raw = raw
    this.firstname = firstname
    this.lastname = lastname
    this.gender = gender
    this.country = country
    this.cityId = cityId
    this.city = city
    this.postalCode = postalCode
    this.interests = interests
    this.emailSubscription = emailSubscription
  }

  getValue(key) {
    if (typeof this[key] === 'undefined') {
      return this.raw[key]
    }

    return this[key]
  }
}

Activist.propTypes = PropTypes.shape({
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  gender: PropTypes.string,
  country: PropTypes.string.isRequired,
  cityId: PropTypes.string,
  city: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailSubscription: PropTypes.bool.isRequired,
})
