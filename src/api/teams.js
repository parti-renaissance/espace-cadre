import { Team, TeamMember } from '../domain/team';
import { apiClient } from '../services/networking/client';

const formatTeamMembers = (members = []) => members.map(({
    adherent_uuid: id,
    first_name: firstname,
    last_name: lastname,
    registered_at: registeredAt,
    postal_code: postalCode,
}) => new TeamMember(id, firstname, lastname, registeredAt, postalCode));

const formatTeam = (team = {}) => {
    const members = new Array(team.members_count).fill(TeamMember.NULL())
    return new Team(team.uuid, team.name, team.creator, members)
};

export const getTeams = async (updater) => {
    const teams = await apiClient.get('api/v3/teams');
    const teamItems = teams.items.map(formatTeam);
    updater?.call(null, teamItems);
}

export const getTeam = async (id, updater) => {
    const team = await apiClient.get(`api/v3/teams/${id}`);
    const teamMembers = formatTeamMembers(team.members);
    const t = new Team(team.uuid, team.name, team.creator, teamMembers);
    updater?.call(null, t);
};

export const addTeamMember = (teamId, memberId) => apiClient.put(`/api/v3/teams/${teamId}/add-members`, [{ adherent_uuid: memberId }]);

export const deleteTeamMember = (teamId, memberId) => apiClient.delete(`api/v3/teams/${teamId}/members/${memberId}`)
