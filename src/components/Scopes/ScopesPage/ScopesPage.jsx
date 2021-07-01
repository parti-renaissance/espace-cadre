/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors';

function ScopesPage() {
    const userScopes = useSelector(getUserScopes);
    const currentUser = useSelector(getCurrentUser);

    function handleClick(scope) {
        console.log(scope);
    }

    return (
        <div className="scopes-page-container">
            <div className="row logo-title-container">
                <img src="images/bar-chart-scopes.svg" alt="Logo data corner" className="page-logo" />
                <span className="page-title">DataCorner</span>
                <span className="beta">BÊTA</span>
            </div>
            <div className="row main-scope-card">
                <div className="col-12 main-card-title">{currentUser.firstName} {currentUser.lastName}</div>
                <div className="col-12 main-card-role">{userScopes.length} rôles</div>
            </div>
            {userScopes.length > 0 && (
                <div className="row secondary-scope-card-container">
                    {userScopes.map((userScope, index) => (
                        <div className="secondary-card" key={index + 1} value={userScope} onClick={() => handleClick(userScope)}>
                            <div className="role">{userScope.code}</div>
                            <div className="zone">{userScope.zones[0].name} {`(${userScope.zones[0].code})`}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScopesPage;
