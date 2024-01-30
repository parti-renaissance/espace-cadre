import PropTypes from 'prop-types'
import { parseDate } from '~/shared/helpers'

export class ElectedAttribute {
  constructor(id, firstName, lastName, gender, contactPhone) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.gender = gender
    this.contactPhone = contactPhone
  }
}

export class Elected extends ElectedAttribute {
  constructor(
    id,
    firstName,
    lastName,
    gender,
    contactPhone,
    emailAddress,
    contactEmail,
    birthDate,
    birthPlace,
    hasFollowedTraining,
    adherent,
    mandates,
    payments
  ) {
    super(id, firstName, lastName, gender, contactPhone)

    this.emailAddress = emailAddress
    this.contactEmail = contactEmail
    this.birthDate = birthDate ? parseDate(birthDate) : null
    this.birthPlace = birthPlace
    this.hasFollowedTraining = hasFollowedTraining
    this.adherent = adherent
    this.mandates = mandates
    this.payments = payments
  }

  static NULL = new Elected(null, '', '', 'male', null, '', '', new Date(), '', false, null, [], [])
}

export class ElectedRepresentative extends ElectedAttribute {
  constructor(
    id,
    firstName,
    lastName,
    gender,
    contactPhone,
    lastContribution,
    contributionStatus,
    contributedAt,
    currentMandates,
    currentPoliticalFunctions
  ) {
    super(id, firstName, lastName, gender, contactPhone)

    this.lastContribution = lastContribution
    this.contributionStatus = contributionStatus
    this.contributedAt = contributedAt ? parseDate(contributedAt) : null
    this.currentMandates = currentMandates
    this.currentPoliticalFunctions = currentPoliticalFunctions
  }

  static NULL = new ElectedRepresentative(null, '', '', 'male', null, null, '', null, [], [], null)
}

export class Mandate {
  constructor(
    id,
    beginAt,
    finishAt,
    type,
    isElected,
    onGoing,
    geoZone,
    politicalAffiliation,
    laREMSupport,
    politicalFunctions
  ) {
    this.id = id
    this.beginAt = parseDate(beginAt)
    this.finishAt = finishAt ? parseDate(finishAt) : null
    this.type = type
    this.isElected = isElected
    this.onGoing = onGoing
    this.geoZone = geoZone
    this.politicalAffiliation = politicalAffiliation
    this.laREMSupport = laREMSupport
    this.politicalFunctions = politicalFunctions
  }

  static NULL = new Mandate(null, new Date(), null, 'conseiller_municipal', false, false, {}, 'RE', '', [])
}

Elected.propTypes = PropTypes.shape({
  id: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  contactPhone: PropTypes.string,
  emailAddress: PropTypes.string,
  contactEmail: PropTypes.string,
  birthDate: PropTypes.object,
  birthPlace: PropTypes.string,
  hasFollowedTraining: PropTypes.bool,
  mandates: PropTypes.shape(Mandate.propTypes),
  payments: PropTypes.array,
})

ElectedRepresentative.propTypes = PropTypes.shape({
  id: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  gender: PropTypes.string,
  contactPhone: PropTypes.string,
  lastContribution: PropTypes.object,
  contributionStatus: PropTypes.string,
  contributedAt: PropTypes.object,
  currentMandates: PropTypes.array,
  currentPoliticalFunctions: PropTypes.array,
})

Mandate.propTypes = PropTypes.shape({
  id: PropTypes.string,
  beginAt: PropTypes.object.isRequired,
  finishAt: PropTypes.object,
  type: PropTypes.string,
  isElected: PropTypes.bool,
  onGoing: PropTypes.bool,
  geoZone: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  politicalAffiliation: PropTypes.string,
  laREMSupport: PropTypes.string,
  politicalFunctions: PropTypes.array,
})
