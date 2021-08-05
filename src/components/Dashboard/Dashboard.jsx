import React from 'react';
import { Container, Grid } from '@material-ui/core';
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign';
import MapComponent from './Map/MapComponent';
import TextChart from './Charts/TextChart/TextChart';

const Dashboard = () => (
    <Container maxWidth="xl" fixed>
        <Grid container>
            <TextChart />
            <KpiEmailCampaign />
            <Grid item xs={12}>
                <p className="title"><img src="images/smartphone.svg" alt="smartphone-logo" />Application mobile</p>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={6} style={{ marginBottom: '16px' }}>
                    <Grid item className="with-background dc-container downloadsCount-grid" style={{ padding: '16px', marginRight: '16px' }}>
                        <DownloadsCount />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid item className="with-background dc-container" style={{ padding: '16px', marginRight: '16px' }}>
                        <ActiveUsers />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className="with-background dc-container">
                <MapComponent />
            </Grid>
        </Grid>
    </Container>
);
export default Dashboard;
