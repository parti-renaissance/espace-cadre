import PropTypes, { arrayOf } from 'prop-types'

export class Team {
  constructor(id, name, creator, members) {
    this.id = id
    this.name = name
    this.creator = creator
    this.members = members
  }

  static NULL = new Team(0, '', '', [])
}

export class TeamMember {
  constructor(id, firstname, lastname, registeredAt, postalCode) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.registeredAt = registeredAt
    this.postalCode = postalCode
  }

  static NULL = new TeamMember(0, '', '', '', '')
}

TeamMember.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  registeredAt: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
})

Team.propTypes = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  creator: PropTypes.string,
  members: arrayOf(TeamMember).propTypes,
})
