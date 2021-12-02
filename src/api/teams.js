import { Team, TeamMember } from '../domain/team'
import { apiClient } from '../services/networking/client'

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

export const getTeamsQuery = async () => {
  const teams = await apiClient.get('api/v3/teams')
  return teams.items.map(formatTeam)
}

export const getTeamQuery = async teamId => {
  const team = await apiClient.get(`api/v3/teams/${teamId}`)
  const teamMembers = formatTeamMembers(team.members)
  return new Team(team.uuid, team.name, team.creator, teamMembers)
}

export const createTeamQuery = ({ values }) => apiClient.post('api/v3/teams', values)
export const updateTeamQuery = ({ teamId, values }) => apiClient.put(`api/v3/teams/${teamId}`, values)

export const addTeamMemberQuery = (teamId, memberId) =>
  apiClient.put(`/api/v3/teams/${teamId}/add-members`, [{ adherent_uuid: memberId }])

export const deleteTeamMemberQuery = (teamId, memberId) =>
  apiClient.delete(`api/v3/teams/${teamId}/members/${memberId}`)
