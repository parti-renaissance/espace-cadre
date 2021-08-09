import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

function Spinner() {
    return (
        <Grid container style={{ marginTop: 'calc(100vh - 70vh)', textAlign: 'center' }}>
            <Grid item xs={12}>
                <CircularProgress />
            </Grid>
            <Grid item xs={12}>
                <strong>Page en cours de chargement</strong>
            </Grid>
        </Grid>
    );
}

export default Spinner;
