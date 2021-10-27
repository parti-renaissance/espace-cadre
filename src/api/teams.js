import { Team, TeamMember } from '../domain/team';
import { apiClient } from '../services/networking/client';

const formatTeamMembers = (members = []) => members.map(({
    adherent_uuid: id,
    first_name: firstname,
    last_name: lastname,
    registred_at: registeredAt,
    postal_code: postalCode,
}) => new TeamMember(id, firstname, lastname, registeredAt, postalCode));

export const getTeam = async (id, updater) => {
    const team = await apiClient.get(`api/v3/teams/${id}`);
    const teamMembers = formatTeamMembers(team?.members);
    const t = new Team(team.uuid, team.name, team.creator, teamMembers);
    updater?.call(null, t);
};

export const getTeams = () => {};
