import { Team, TeamMember } from 'domain/team'
import { apiClient } from 'services/networking/client'
import { newPaginatedResult } from 'api/pagination'

const formatTeamMembers = (members = []) =>
  members.map(
    ({
      adherent_uuid: id,
      first_name: firstname,
      last_name: lastname,
      registered_at: registeredAt,
      postal_code: postalCode,
    }) => new TeamMember(id, firstname, lastname, registeredAt, postalCode)
  )

const formatTeam = (team = {}) => {
  const members = new Array(team.members_count).fill(TeamMember.NULL)
  return new Team(team.uuid, team.name, team.creator, members)
}

export const getTeamsQuery = async ({ pageParam: page = 1 }) => {
  const data = await apiClient.get(`api/v3/teams?order[created_at]=desc&page=${page}&page_size=20`)
  const teams = data.items.map(formatTeam)
  return newPaginatedResult(teams, data.metadata)
}

export const getTeamQuery = async teamId => {
  const team = await apiClient.get(`api/v3/teams/${teamId}`)
  const teamMembers = formatTeamMembers(team.members)
  return new Team(team.uuid, team.name, team.creator, teamMembers)
}

export const createTeamQuery = team =>
  apiClient.post('api/v3/teams', {
    name: team.name,
  })
export const updateTeamQuery = team =>
  apiClient.put(`api/v3/teams/${team.id}`, {
    name: team.name,
  })

export const addTeamMemberQuery = ({ teamId, memberId }) =>
  apiClient.put(`/api/v3/teams/${teamId}/add-members`, [{ adherent_uuid: memberId }])

export const deleteTeamMemberQuery = ({ teamId, memberId }) =>
  apiClient.delete(`api/v3/teams/${teamId}/members/${memberId}`)
