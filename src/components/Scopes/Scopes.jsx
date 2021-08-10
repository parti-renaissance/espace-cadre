import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Grid, Box } from '@material-ui/core';
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors';
import { useUserScope } from '../../redux/user/hooks';

function Scopes() {
    const currentUser = useSelector(getCurrentUser);
    // eslint-disable-next-line no-unused-vars
    const [currentScope, updateCurrentScope] = useUserScope();
    const userScopes = useSelector(getUserScopes);
    const history = useHistory();
    const filteredScopes = userScopes.filter((scope) => scope.apps.includes('data_corner'));

    const redirect = () => {
        history.push('/');
    };

    const handleChange = (userScope) => {
        updateCurrentScope(userScope);
        redirect();
    };

    return (
        <Grid className="scopes-container">
            {currentUser && filteredScopes.length > 0 && (
                <Dropdown>
                    <Dropdown.Toggle variant="">
                        <Grid container>
                            <Grid item xs={10}>
                                <Box component="span" className="profile-id">{currentUser.firstName} {currentUser.lastName}</Box> <br />
                            </Grid>
                            <Grid item xs={2} style={{ textAlign: 'right' }}>
                                <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                            </Grid>
                        </Grid>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item href={process.env.REACT_APP_OAUTH_HOST}>
                            <Box component="span" className="profile-role">Retour sur en-marche.fr</Box>
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
        </Grid>
    );
}

export default Scopes;
