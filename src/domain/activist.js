import PropTypes from 'prop-types'

export default class Activist {
  constructor(
    firstname,
    lastname,
    gender,
    country,
    regionId,
    region,
    departmentId,
    department,
    cityId,
    city,
    postalCode,
    interests,
    emailSubscription,
    smsSubscription,
    raw
  ) {
    this.raw = raw
    this.firstname = firstname
    this.lastname = lastname
    this.gender = gender
    this.country = country
    this.regionId = regionId
    this.region = region
    this.departmentId = departmentId
    this.department = department
    this.cityId = cityId
    this.city = city
    this.postalCode = postalCode
    this.interests = interests
    this.emailSubscription = emailSubscription
    this.smsSubscription = smsSubscription
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
  gender: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  regionId: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  departmentId: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  cityId: PropTypes.string,
  city: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailSubscription: PropTypes.bool.isRequired,
  smsSubscription: PropTypes.bool.isRequired,
})
