import PropTypes from 'prop-types'

export default class Activist {
  constructor(
    firstname,
    lastname,
    gender,
    country,
    cityId,
    city,
    committee,
    committeeId,
    postalCode,
    interests,
    emailSubscription,
    contributingDate,
    joinedDate,
    adherentUuid,
    raw
  ) {
    this.raw = raw
    this.firstname = firstname
    this.lastname = lastname
    this.gender = gender
    this.country = country
    this.cityId = cityId
    this.city = city
    this.committee = committee
    this.committeeId = committeeId
    this.contributingDate = contributingDate ? new Date(contributingDate) : null
    this.joinedDate = joinedDate ? new Date(joinedDate) : null
    this.postalCode = postalCode
    this.interests = interests
    this.emailSubscription = emailSubscription
    this.adherentUuid = adherentUuid
  }
}

Activist.propTypes = PropTypes.shape({
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  gender: PropTypes.string,
  country: PropTypes.string.isRequired,
  cityId: PropTypes.string,
  city: PropTypes.string.isRequired,
  committee: PropTypes.string,
  committeeId: PropTypes.string,
  postalCode: PropTypes.string.isRequired,
  contributingDate: PropTypes.object,
  joinedDate: PropTypes.object,
  interests: PropTypes.arrayOf(PropTypes.string).isRequired,
  emailSubscription: PropTypes.bool.isRequired,
  adherentUuid: PropTypes.string.isRequired,
})
