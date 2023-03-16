import PropTypes from 'prop-types'
import { add } from 'date-fns'

export class Designation {
  constructor(id, title, description, electionDate, voteStartDate, voteEndDate) {
    this.id = id
    this.title = title
    this.description = description
    this.electionDate = new Date(electionDate)
    this.voteStartDate = new Date(voteStartDate)
    this.voteEndDate = new Date(voteEndDate)
  }

  static NULL = new Designation(null, '', '', new Date(), add(new Date(), { days: 16 }), add(new Date(), { days: 17 }))
}

Designation.propTypes = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  electionDate: PropTypes.object,
  voteStartDate: PropTypes.object.isRequired,
  voteEndDate: PropTypes.object.isRequired,
})

export class CommitteeElection {
  constructor(id, designation, groups, status, votersCount, voteCount, committeeId) {
    this.id = id
    this.designation = designation
    this.groups = groups
    this.status = status
    this.votersCount = votersCount || 0
    this.voteCount = voteCount || 0
    this.committeeId = committeeId
  }

  static NULL = new CommitteeElection(null, Designation.NULL, [], null, 0, 0, null)
}

CommitteeElection.propTypes = PropTypes.shape({
  id: PropTypes.string,
  designation: Designation.propTypes.isRequired,
  groups: PropTypes.array.isRequired,
  status: PropTypes.string,
  votersCount: PropTypes.number,
  voteCount: PropTypes.number,
  committeeId: PropTypes.string,
})
