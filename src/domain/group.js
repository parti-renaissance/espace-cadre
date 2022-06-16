import PropTypes, { arrayOf } from 'prop-types'
import { Zone } from './zone'
export class Group {
  constructor(id, name, creator, members, zone, isDeletable) {
    this.id = id
    this.name = name
    this.creator = creator
    this.members = members
    this.zone = zone
    this.isDeletable = isDeletable
  }

  static NULL = new Group(0, '', '', [], null, false)

  withName = newName => new Group(this.id, newName, this.creator, this.members, this.zone, this.isDeletable)
  withZone = newZone => new Group(this.id, this.name, this.creator, this.members, newZone, this.isDeletable)
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
  zone: Zone.PropTypes,
  isDeletable: PropTypes.bool,
})
