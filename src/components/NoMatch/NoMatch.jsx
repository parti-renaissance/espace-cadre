import React from 'react';
import {
    useLocation, Link,
} from 'react-router-dom';
import { Grid } from '@material-ui/core';

function NoMatch() {
    const location = useLocation();

    return (
        <Grid className="container">
            <Grid
                container
                className="with-background dc-container"
                style={{ padding: '16px', textAlign: 'center' }}
            >
                <Grid item xs={12}>
                    L&apos;URL recherchée <strong>{location.pathname}</strong> n&apos;existe pas ou vous n&apos;avez pas les droits pour y accéder
                </Grid>
                <Grid item xs={12}>
                    <Link
                        to="/"
                        className="btn"
                        style={{ color: 'white', marginTop: '16px', background: '#0049C6' }}
                    >
                        Retournez à l&apos;accueil
                    </Link>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default NoMatch;
