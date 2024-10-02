import PropTypes from 'prop-types'
import { electionStatus } from '~/components/Committees/constants'
import { Designation } from '~/domain/designation'

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

  isEditable() {
    return [electionStatus.not_started, electionStatus.scheduled].includes(this.status)
  }

  isDateEditable() {
    return electionStatus.not_started === this.status
  }

  isCanceled() {
    return electionStatus.canceled === this.status
  }

  canCreateNew() {
    return [electionStatus.closed, electionStatus.canceled].includes(this.status)
  }

  static NULL = new CommitteeElection(null, Designation.NULL, [], 'not_started', 0, 0, null)
}

CommitteeElection.propTypes = PropTypes.shape({
  id: PropTypes.string,
  designation: PropTypes.instanceOf(Designation).isRequired,
  groups: PropTypes.array.isRequired,
  status: PropTypes.string,
  votersCount: PropTypes.number,
  voteCount: PropTypes.number,
  committeeId: PropTypes.string,
})
