import { Group, GroupMember } from 'domain/group'
import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'
import { Zone } from 'domain/zone'

const formatGroupMembers = (members = []) =>
  members.map(
    ({
      adherent_uuid: id,
      first_name: firstname,
      last_name: lastname,
      registered_at: registeredAt,
      postal_code: postalCode,
    }) => new GroupMember(id, firstname, lastname, registeredAt, postalCode)
  )

const formatGroup = (group = {}) => {
  const members = new Array(group.members_count).fill(GroupMember.NULL)
  const isNational = group.visibility === 'national'

  if (isNational) {
    return new Group(group.uuid, group.name, group.creator, members, null, group.is_deletable)
  }

  return new Group(
    group.uuid,
    group.name,
    group.creator,
    members,
    new Zone(group.zone.uuid, group.zone.name, group.zone.code),
    group.is_deletable
  )
}

export const getGroupsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/teams?order[created_at]=desc&page=${page}&page_size=20`)
  const groups = data.items.map(formatGroup)
  return newPaginatedResult(groups, data.metadata)
}

export const getGroupQuery = async groupId => {
  const group = await apiClient.get(`api/v3/teams/${groupId}`)
  const groupMembers = formatGroupMembers(group.members)
  const isNational = group.visibility === 'national'

  if (isNational) {
    return new Group(group.uuid, group.name, group.creator, groupMembers, null, group.is_deletable)
  }

  return new Group(
    group.uuid,
    group.name,
    group.creator,
    groupMembers,
    new Zone(group.zone.uuid, group.zone.name, group.zone.code),
    group.is_deletable
  )
}

export const createGroupQuery = group =>
  apiClient.post('api/v3/teams', {
    name: group.name,
    zone: group.zone,
  })
export const updateGroupQuery = group =>
  apiClient.put(`api/v3/teams/${group.id}`, {
    name: group.name,
    zone: group.zone,
  })

export const addGroupMemberQuery = ({ groupId, memberId }) =>
  apiClient.put(`api/v3/teams/${groupId}/add-members`, [{ adherent_uuid: memberId }])

export const deleteGroupMemberQuery = ({ groupId, memberId }) =>
  apiClient.delete(`api/v3/teams/${groupId}/members/${memberId}`)

export const deleteGroupQuery = groupId => apiClient.delete(`api/v3/teams/${groupId}`)
