/* eslint-disable max-classes-per-file */
import PropTypes from 'prop-types';

export class Team {
    constructor(id, name, creator, members) {
        this.id = id;
        this.name = name;
        this.creator = creator;
        this.members = members;
    }
}

export class TeamMember {
    constructor(id, firstname, lastname, registeredAt, postalCode) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.registeredAt = registeredAt;
        this.postalCode = postalCode;
    }
}

TeamMember.propTypes = PropTypes.shape({
    id: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    registeredAt: PropTypes.string.isRequired,
    postalCode: PropTypes.string.isRequired,
});

Team.propTypes = PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    creator: PropTypes.string,
    members: TeamMember.propTypes,
});
