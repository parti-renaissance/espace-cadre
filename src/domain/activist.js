import PropTypes from 'prop-types'

export default class Activist {
  constructor(
    firstname,
    lastname,
    gender,
    country,
    cityId,
    city,
    postalCode,
    interests,
    emailSubscription,
    contributingDate,
    joinedDate,
    raw
  ) {
    this.raw = raw
    this.firstname = firstname
    this.lastname = lastname
    this.gender = gender
    this.country = country
    this.cityId = cityId
    this.city = city
    this.contributingDate = contributingDate ? new Date(contributingDate) : null
    this.joinedDate = joinedDate ? new Date(joinedDate) : null
    this.postalCode = postalCode
    this.interests = interests
    this.emailSubscription = emailSubscription
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
  contributingDate: PropTypes.string,
  joinedDate: PropTypes.string,
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailSubscription: PropTypes.bool.isRequired,
})
