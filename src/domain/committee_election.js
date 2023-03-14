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

  static NULL = new Designation(null, '', '', new Date(), add(new Date(), { days: 15 }), add(new Date(), { days: 16 }))
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
  constructor(id, designation, groups, committeeId) {
    this.id = id
    this.designation = designation
    this.groups = groups
    this.committeeId = committeeId
  }

  static NULL = new CommitteeElection(null, Designation.NULL, [], null)
}

CommitteeElection.propTypes = PropTypes.shape({
  id: PropTypes.string,
  designation: Designation.propTypes.isRequired,
  groups: PropTypes.array.isRequired,
  committeeId: PropTypes.string,
})
