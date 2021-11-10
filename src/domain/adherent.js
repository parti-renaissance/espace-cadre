import PropTypes from 'prop-types'

export default class Adherent {
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
    smsSubscription
  ) {
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
}

Adherent.propTypes = PropTypes.shape({
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  regionId: PropTypes.string.isRequired,
  region: PropTypes.string.isRequired,
  departmentId: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
  cityId: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailSubscription: PropTypes.bool.isRequired,
  smsSubscription: PropTypes.bool.isRequired,
})
