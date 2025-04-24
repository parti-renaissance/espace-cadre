import { apiClient } from '~/services/networking/client'

import { MyTeam, MyTeamMember, MyTeamMemberActivist } from '~/domain/my-team'
import { ADHERENT_AUTOCOMPLETE_URI } from '~/components/Filters/Element/AdherentAutocomplete'

export const getMyTeamQuery = async () => {
  const data = await apiClient.get('api/v3/my_teams')

  const team = data.items[0]
  if (!team) {
    return new MyTeam(null, [])
  }

  const members = team.members.map(m => {
    const adherent = m.adherent
      ? new MyTeamMemberActivist(m.adherent.uuid, m.adherent.first_name, m.adherent.last_name, m.adherent.email_address)
      : null
    return new MyTeamMember(m.uuid, m.role, adherent, m.scope_features)
  })

  return new MyTeam(team.uuid, members)
}

export const getMyTeamActivists = async query => {
  const data = await apiClient.get(`${ADHERENT_AUTOCOMPLETE_URI}?q=${encodeURIComponent(query)}`)
  return data.map(a => ({
    pid: a.id,
    id: a.uuid,
    firstName: a.first_name,
    lastName: a.last_name,
    postCode: a.postal_code,
    emailAddress: a.email_address,
  }))
}

const createMyTeamQuery = async () => {
  const data = await apiClient.post('api/v3/my_teams', {})
  return data.uuid
}

export const createOrUpdateTeamMemberQuery = async ({ teamId, teamMember }) => {
  const team = teamId || (await createMyTeamQuery())
  const body = {
    adherent: teamMember.activist.id,
    role: teamMember.role,
    ...(teamMember.features && { scope_features: teamMember.features }),
  }
  if (!teamMember.id) {
    return apiClient.post('api/v3/my_team_members', { team, ...body })
  }

  return apiClient.put(`api/v3/my_team_members/${teamMember.id}`, body)
}

export const removeTeamMemberQuery = memberId => apiClient.delete(`api/v3/my_team_members/${memberId}`)
