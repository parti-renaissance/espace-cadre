import PropTypes from 'prop-types'

export class ElectionResult {
  constructor(nuance, name, firstname, votesCount, colorCode) {
    this.colorCode = colorCode
    this.nuance = nuance
    this.name = name
    this.firstname = firstname
    this.votesCount = votesCount
  }

  static NULL = new ElectionResult('', '', '', 0, '')
}

ElectionResult.propTypes = PropTypes.shape({
  colorCode: PropTypes.string.isRequired,
  nuance: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,
})
