import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors';
import { useUserScope } from '../../../redux/user/hooks';

function ScopesPage() {
    const userScopes = useSelector(getUserScopes);
    const currentUser = useSelector(getCurrentUser);
    const [, updateCurrentScope] = useUserScope();

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
                        <Link
                            className="secondary-card"
                            to="/"
                            key={index + 1}
                            value={userScope}
                            onClick={() => updateCurrentScope(userScope)}
                        >
                            <div className="role">{userScope.name}</div>
                            {
                                userScope.zones.length > 1
                                    ? (
                                        <>
                                            <div className="zone">{`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length} zone{userScope.zones.slice(1).length > 1 && 's'}</div>
                                        </>
                                    )
                                    : <div className="zone">{userScope.zones[0].name} ({userScope.zones[0].code})</div>
                            }

                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ScopesPage;
