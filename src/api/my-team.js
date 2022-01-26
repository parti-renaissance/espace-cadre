import { apiClient } from 'services/networking/client'

import { newPaginatedResult } from 'api/pagination'
import { MyTeamMember, MyTeamMemberAdherent } from '../domain/my-team'

export const getMyTeamQuery = async ({ pageParam: page = 1 }) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20`
  const data = await apiClient.get(`api/v3/my_teams${query}`)

  const myTeam = data.items.map(t => {
    const members = t.members.map(m => {
      const adherent = m.adherent ? new MyTeamMemberAdherent(m.adherent.first_name, m.adherent.last_name) : null
      return new MyTeamMember(m.uuid, m.role, adherent, m.scope_features.length)
    })
    return {
      members,
    }
  })

  return newPaginatedResult(myTeam, data.metadata)
}
