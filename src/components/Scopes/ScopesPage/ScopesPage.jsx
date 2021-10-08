import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Grid, Box } from '@material-ui/core';
import { getCurrentUser, getUserScopes } from '../../../redux/user/selectors';
import { useUserScope } from '../../../redux/user/hooks';
import { PATHS } from '../../../Routes';

function ScopesPage() {
    const userScopes = useSelector(getUserScopes);
    const currentUser = useSelector(getCurrentUser);
    const [, updateCurrentScope] = useUserScope();
    const filteredScopes = userScopes.filter((scope) => scope.apps.includes('data_corner'));

    return (
        <Container maxWidth="xl" className="scopes-page-container">
            <Grid container className="logo-title-container">
                <img src="/images/bar-chart-scopes.svg" alt="Logo data corner" className="page-logo" />
                <span className="page-title">DataCorner</span>
                <span className="beta">BÊTA</span>
            </Grid>
            <Grid container className="main-scope-card">
                <Grid item xs={12}>
                    <Box className="main-card-title">{currentUser.firstName} {currentUser.lastName}</Box>
                </Grid>
                <Grid item xs={12}>
                    <Box className="main-card-role">{filteredScopes.length} rôles</Box>
                </Grid>
            </Grid>
            {filteredScopes.length > 0 && (
                <Grid container className="secondary-scope-card-container">
                    {filteredScopes.map((userScope, index) => (
                        <Link
                            className="secondary-card"
                            to={PATHS.DASHBOARD.route}
                            key={index + 1}
                            value={userScope}
                            onClick={() => updateCurrentScope(userScope)}
                        >
                            <Box className="role">{userScope.name}</Box>
                            {
                                userScope.zones.length > 1
                                    ? (
                                        <>
                                            <Box className="zone">{`${userScope.zones[0].name} (${userScope.zones[0].code})`} + {userScope.zones.slice(1).length} zone{userScope.zones.slice(1).length > 1 && 's'}</Box>
                                        </>
                                    )
                                    : <Box className="zone">{userScope.zones[0].name} ({userScope.zones[0].code})</Box>
                            }

                        </Link>
                    ))}
                </Grid>
            )}
        </Container>
    );
}

export default ScopesPage;
