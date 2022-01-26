import PropTypes from 'prop-types'

export class MyTeamMemberAdherent {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  static propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }
}

export class MyTeamMember {
  constructor(id, role, adherent, accessCount) {
    this.id = id
    this.role = role
    this.adherent = adherent
    this.accessCount = accessCount
  }
  static propTypes = {
    id: PropTypes.string,
    role: PropTypes.bool.isRequired,
    adherent: PropTypes.shape(MyTeamMemberAdherent.propTypes),
    accessCount: PropTypes.string.isRequired,
  }
}
