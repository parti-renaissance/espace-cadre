import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
    Grid, Button, Menu, MenuItem, Divider, makeStyles, createStyles, Box,
} from '@material-ui/core';
import { getCurrentUser, getUserScopes } from '../../redux/user/selectors';
import { useUserScope } from '../../redux/user/hooks';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        '&:first-child': {
            width: '240px',
        },
        '&:not(:first-child)': {
            padding: '0',
        },
        '&:not(:last-child)': {
            marginBottom: '8px',
        },
    },
    menuPaper: {
        marginTop: '50px',
        background: theme.palette.whiteCorner,
        width: '240px',
    },
    scopeButton: {
        background: theme.palette.gray100,
        margin: '0 15.5px 16px',
        width: '240px',
        height: '34px',
        justifyContent: 'space-between',
        padding: '0 12px',
        '&:hover': {
            background: theme.palette.gray200,
        },
    },
    menuItem: {
        color: 'black',
        fontSize: '14px',
        fontWeight: '400',
        padding: '8px 16px',
        width: '210px',
        backgroundColor: '#F7F9FC',
        borderRadius: '6px',
        '&:hover': {
            background: 'linear-gradient(0deg,rgba(0,0,0,.05),rgba(0,0,0,.05)),#f7f9fc',
        },
    },
    divider: {
        margin: '8px 0',
        color: theme.palette.gray100,
    },
    profilePlace: {
        fontSize: '10px',
        fontWeight: '400',
    },
    returnButton: {
        color: 'black',
    },
    activeScope: {
        fontSize: '14px',
        fontWeight: '600',
        textTransform: 'capitalize',
    },
}));

function Scopes() {
    const currentUser = useSelector(getCurrentUser);
    // eslint-disable-next-line no-unused-vars
    const [currentScope, updateCurrentScope] = useUserScope();
    const userScopes = useSelector(getUserScopes);
    const history = useHistory();
    const filteredScopes = userScopes.filter((scope) => scope.apps.includes('data_corner'));
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const redirect = () => {
        history.push('/');
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleChange = (userScope) => {
        updateCurrentScope(userScope);
        setAnchorEl(null);
        redirect();
    };

    const scopesContent = (scope) => {
        if (scope?.zones?.length === 1) {
            return <Box className="zone">{scope.zones[0].name} ({scope.zones[0].code})</Box>;
        }
        if (scope?.zones?.length > 1) {
            return <Box className="zone">{`${scope.zones[0].name} (${scope.zones[0].code})`} + {scope.zones.slice(1).length} zone{scope.zones.slice(1).length > 1 && 's'}</Box>;
        }
        return null;
    };

    return (
        <Grid className="scopes-container">
            {currentUser && filteredScopes?.length > 0 && (
                <>
                    <Button onClick={handleClick} className={classes.scopeButton}>
                        <span className={classes.activeScope}>{currentUser.firstName} {currentUser.lastName}</span>
                        <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        classes={{ paper: classes.menuPaper }}
                    >
                        <MenuItem
                            classes={{ root: classes.root }}
                            className={classes.menuItem}
                        >
                            <a
                                href={process.env.REACT_APP_OAUTH_HOST}
                                className={classes.returnButton}
                            >Retour sur en-marche.fr
                            </a>
                        </MenuItem>

                        {filteredScopes && filteredScopes.length > 1 && <Divider className={classes.divider} />}

                        {filteredScopes && filteredScopes.map((userScope, i) => (
                            <MenuItem
                                key={i}
                                onClick={() => handleChange(userScope)}
                                disableGutters
                                classes={{ root: classes.root }}
                            >
                                <span
                                    style={{ backgroundColor: (userScope && userScope.code === currentScope.code ? '#D9EAFF' : '#F7F9FC') }}
                                    className={classes.menuItem}
                                >{userScope && userScope.name} <br />
                                    {scopesContent(userScope)}
                                </span>
                            </MenuItem>
                        ))}
                    </Menu>
                </>
            )}
        </Grid>
    );
}

export default Scopes;
