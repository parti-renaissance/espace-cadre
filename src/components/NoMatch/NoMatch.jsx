import React from 'react';
import {
    useLocation, Link,
} from 'react-router-dom';
import {
    Grid, makeStyles, createStyles, Container,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => createStyles({
    noMatchGridContainer: {
        textAlign: 'center',
        padding: '16px',
        margin: '16px auto',
    },
    noMatchText: {
        marginBottom: '16px',
    },
    noMatchButton: {
        color: 'white',
        background: theme.palette.blueCorner,
        borderRadius: '8px',
        padding: '8px 16px',
    },
}));

function NoMatch() {
    const location = useLocation();
    const classes = useStyles();

    return (
        <Container
            fixed
            className={`${classes.noMatchGridContainer} with-background dc-container`}
        >
            <Grid item xs={12} className={classes.noMatchText}>
                L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder
            </Grid>
            <Grid item xs={12}>
                <Link
                    to="/"
                    className={classes.noMatchButton}
                >
                    Retournez à l&apos;accueil
                </Link>
            </Grid>
        </Container>

    );
}

export default NoMatch;
