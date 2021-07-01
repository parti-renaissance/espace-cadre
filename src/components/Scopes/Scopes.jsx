import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors';

function Scopes() {
    const userScopes = useSelector(getUserScopes);
    const currentUser = useSelector(getCurrentUser);

    function parseName(name) {
        if (name === 'candidate') {
            return 'Candidat';
        } if (name === 'deputy') {
            return 'Député';
        } if (name === 'senator') {
            return 'Sénateur';
        }
        return 'Référent';
    }
    return (
        <div>
            {currentUser && userScopes.length > 0 && (
                <Dropdown>
                    <Dropdown.Toggle variant="">
                        <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                        <span className="profile-info"> {parseName(userScopes[0].code)} &gt; {userScopes[0].zones[0].name} {`(${userScopes[0].zones[0].code})`}</span>
                        <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="https://en-marche.fr/">
                            <span className="profile-role">Retour sur en-marche.fr</span>
                        </Dropdown.Item>
                        {userScopes.slice(1).map((role, i) => (
                            <Dropdown.Item href="#/action-2" key={i + 1}>
                                <span className="profile-role">{parseName(role.code)}</span> <br />
                                <span className="profile-place">{role.zones[0].name} {`(${role.zones[0].code})`}</span>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </div>
    );
}

export default Scopes;
