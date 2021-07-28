import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors';
import { useUserScope } from '../../redux/user/hooks';

function Scopes() {
    const currentUser = useSelector(getCurrentUser);
    // eslint-disable-next-line no-unused-vars
    const [currentScope, updateCurrentScope] = useUserScope();
    const userScopes = useSelector(getUserScopes);
    const history = useHistory();
    const filteredScopes = userScopes.filter((scope) => scope.apps.filter((el) => el === 'data_corner'));

    const redirect = () => {
        history.push('/');
    };

    const handleChange = (userScope) => {
        updateCurrentScope(userScope);
        redirect();
    };

    return (
        <div className="scopes-container" style={{ marginTop: '3px' }}>
            {currentUser && filteredScopes.length > 0 && (
                <Dropdown>
                    <Dropdown.Toggle variant="">
                        <div className="row">
                            <div className="col-10">
                                <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                            </div>
                            <div className="col-2">
                                <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                            </div>
                        </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href={process.env.REACT_APP_OAUTH_HOST}>
                            <span className="profile-role">Retour sur en-marche.fr</span>
                        </Dropdown.Item>

                        {filteredScopes.length > 1 && <Dropdown.Divider />}

                        {filteredScopes.map((userScope, i) => (
                            <Dropdown.Item
                                key={i + 1}
                                onClick={() => handleChange(userScope)}
                                style={{ backgroundColor: (userScope.code === currentScope.code ? '#D9EAFF' : '#F7F9FC') }}
                            >
                                <span className="profile-role">{userScope.name}</span> <br />

                                {
                                    userScope.zones.length > 1
                                        ? <span className="profile-place">{`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length} zone{userScope.zones.slice(1).length > 1 && 's'}</span>
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
