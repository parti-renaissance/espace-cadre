import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import {
    getCurrentUser,
    getCurrentScope,
    getUserScopes,
} from '../../redux/user/selectors';
import {
    updateCurrentScope,
} from '../../redux/auth/slice';
import ParseName from './ParseName';

function Scopes() {
    const currentUser = useSelector(getCurrentUser);
    const currentScope = useSelector(getCurrentScope);
    const userScopes = useSelector(getUserScopes);
    const dispatch = useDispatch();

    function handleClick(scope) {
        dispatch(updateCurrentScope(scope));
    }

    return (
        <div>
            {currentUser && userScopes.length > 0 && (
                <Dropdown>
                    <Dropdown.Toggle variant="">
                        <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                        <span className="profile-info"> <ParseName name={currentScope.code} /> &gt; {currentScope.zones[0].name} {`(${currentScope.zones[0].code})`}</span>
                        <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href="https://en-marche.fr/">
                            <span className="profile-role">Retour sur en-marche.fr</span>
                        </Dropdown.Item>
                        {userScopes.filter((el) => el !== currentScope).map((userScope, i) => (
                            <Dropdown.Item href="#/action-2" key={i + 1} onClick={() => handleClick(userScope)}>
                                <span className="profile-role"><ParseName name={userScope.code} /></span> <br />
                                <span className="profile-place">{userScope.zones[0].name} {`(${userScope.zones[0].code})`}</span>
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )}
        </div>
    );
}

export default Scopes;
