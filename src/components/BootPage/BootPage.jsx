import React from 'react';
import { Container, Grid } from '@material-ui/core';

function BootPage() {
    return (
        <Container maxWidth="xl" style={{ marginTop: 'calc(100vh - 80vh)', textAlign: 'center' }}>
            <Grid container>
                <Grid item xs={12} style={{ margin: '48px 0' }}>
                    <h2>L&apos;application sera bientôt prête</h2>
                </Grid>
                <Grid item xs={12}>
                    <img src="images/bootPage.svg" alt="loading" />
                </Grid>
            </Grid>
        </Container>
    );
}

export default BootPage;
