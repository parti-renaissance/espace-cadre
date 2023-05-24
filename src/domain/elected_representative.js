import PropTypes from 'prop-types'

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
    this.beginAt = new Date(beginAt)
    this.finishAt = finishAt ? new Date(finishAt) : null
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

Mandate.propTypes = PropTypes.shape({
  id: PropTypes.string,
  beginAt: PropTypes.object.isRequired,
  finishAt: PropTypes.object,
  type: PropTypes.string,
  isElected: PropTypes.bool,
  onGoing: PropTypes.bool,
  geoZone: PropTypes.arrayOf([PropTypes.object, PropTypes.string]),
  politicalAffiliation: PropTypes.string,
  laREMSupport: PropTypes.string,
  politicalFunctions: PropTypes.array,
})
