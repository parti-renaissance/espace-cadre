import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors';
import { useUserScope } from '../../redux/user/hooks';

function Scopes() {
    const currentUser = useSelector(getCurrentUser);
    const [currentScope, updateCurrentScope] = useUserScope();
    const userScopes = useSelector(getUserScopes);

    let zone = null;

    if (currentScope && currentScope.zones !== undefined && currentScope.zones.length) {
        zone = `${currentScope.zones[0].name} (${currentScope.zones[0].code})`;
    }
    return (
        <div>
            {currentUser && userScopes.length > 0 && (
                <Dropdown>
                    <Dropdown.Toggle variant="">
                        <div className="row">
                            <div className="col-10 info-col">
                                <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                                <span className="profile-info">{currentScope.name}{zone && ` > ${zone}`}</span>
                            </div>
                            <div className="col-2 caret-col">
                                <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                            </div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href={process.env.REACT_APP_OAUTH_HOST}>
                            <span className="profile-role">Retour sur en-marche.fr</span>
                        </Dropdown.Item>

                        {userScopes.length > 1 && <Dropdown.Divider />}

                        {userScopes.filter((el) => el.code !== currentScope.code).map((userScope, i) => (
                            <Dropdown.Item key={i + 1} onClick={() => updateCurrentScope(userScope)}>
                                <span className="profile-role">{userScope.name}</span> <br />

                                {
                                    userScope.zones.length > 1
                                        ? <span className="profile-place">{userScope.zones.map((el, index) => <div key={index + 1}>{el.name} ({el.code})</div>)}</span>
                                        : <span className="profile-place">{userScope.zones[0].name} {`(${userScope.zones[0].code})`}</span>
                                }
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </div>
    );
}

export default Scopes;
