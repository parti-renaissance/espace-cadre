import PropTypes from 'prop-types'

export class MyTeamMemberActivist {
  constructor(id, firstName, lastName, emailAddress) {
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.emailAddress = emailAddress
  }
  static propTypes = {
    id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
  }
}

export class MyTeamMember {
  constructor(id, role, activist, features) {
    this.id = id
    this.role = role
    this.activist = activist
    this.features = features
  }
  static propTypes = {
    id: PropTypes.string,
    role: PropTypes.string.isRequired,
    activist: PropTypes.shape(MyTeamMemberActivist.propTypes),
    features: PropTypes.arrayOf(PropTypes.string),
  }
}

export class MyTeam {
  constructor(id, members) {
    this.id = id
    this.members = members
  }
  static propTypes = {
    id: PropTypes.string,
    members: PropTypes.arrayOf(MyTeamMember.propTypes).isRequired,
  }
}
