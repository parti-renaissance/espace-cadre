import React from 'react';
import { Container, Grid, Box } from '@material-ui/core';
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign';
import MapComponent from './Map/MapComponent';
import TextChart from './Charts/TextChart/TextChart';

const Dashboard = () => (
    <Container maxWidth="xl" fixed>
        <Grid container>
            <Box mb={2}>
                <TextChart />
            </Box>
            <KpiEmailCampaign />
            <Grid item xs={12}>
                <p className="title"><img src="images/smartphone.svg" alt="smartphone-logo" className="ml-2 mr-2" />Application mobile</p>
            </Grid>
            <Grid container>
                <Grid item xs={12} lg={6}>
                    <Box className="with-background dc-container">
                        <DownloadsCount />
                    </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Box className="right-chart">
                        <div className="with-background dc-container">
                            <ActiveUsers />
                        </div>
                    </Box>
                </Grid>
            </Grid>
            <Grid item xs={12} className="with-background dc-container">
                <MapComponent />
            </Grid>
        </Grid>
    </Container>
);
export default Dashboard;
