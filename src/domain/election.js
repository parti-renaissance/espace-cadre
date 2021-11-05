import PropTypes from 'prop-types'

export class ElectionParticipation {
  constructor(registered, voting, votesCast) {
    this.registered = registered
    this.voting = voting
    this.votesCast = votesCast
  }
}

export class ElectionResult {
  constructor(nuance, colorCode, candidateFirstname, candidateLastname, votesCount) {
    this.nuance = nuance
    this.colorCode = colorCode
    this.candidateFirstname = candidateFirstname
    this.candidateLastname = candidateLastname
    this.votesCount = votesCount
  }
}

ElectionParticipation.propTypes = PropTypes.shape({
  registered: PropTypes.number.isRequired,
  voting: PropTypes.number.isRequired,
  votesCast: PropTypes.number.isRequired,
})

ElectionResult.propTypes = PropTypes.shape({
  nuance: PropTypes.string.isRequired,
  colorCode: PropTypes.string.isRequired,
  candidateFirstname: PropTypes.string.isRequired,
  candidateLastname: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,
})
