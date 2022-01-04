import PropTypes, { arrayOf } from 'prop-types'

export class Group {
  constructor(id, name, creator, members) {
    this.id = id
    this.name = name
    this.creator = creator
    this.members = members
  }

  static NULL = new Group(0, '', '', [])

  withName = newName => new Group(this.id, newName, this.creator, this.members)
}

export class GroupMember {
  constructor(id, firstname, lastname, registeredAt, postalCode) {
    this.id = id
    this.firstname = firstname
    this.lastname = lastname
    this.registeredAt = registeredAt
    this.postalCode = postalCode
  }

  static NULL = new GroupMember(0, '', '', '', '')
}

GroupMember.propTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  registeredAt: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
})

Group.propTypes = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  creator: PropTypes.string,
  members: arrayOf(GroupMember).propTypes,
})
