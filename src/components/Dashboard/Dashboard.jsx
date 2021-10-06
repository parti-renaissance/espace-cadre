import React from 'react';
import {
    Container, Grid, makeStyles, createStyles,
} from '@material-ui/core';
import ActiveUsers from './Charts/ActiveUsers/ActiveUsers';
import DownloadsCount from './Charts/DownloadsCount/DownloadsCount';
import KpiEmailCampaign from './Charts/KpiEmailCampaign/KpiEmailCampaign';
import MapComponent from './Map/MapComponent';
import TextChart from './Charts/TextChart/TextChart';

const useStyles = makeStyles((theme) => createStyles({
    mainContainer: {
        marginBottom: '16px',
    },
    title: {
        fontSize: '20px',
        fontWeight: '700',
        margin: '0 0 15px 8px',
        color: theme.palette.grayCorner3,
    },
    phoneImg: {
        verticalAlign: 'middle',
        marginRight: '8px',
    },
    kpiContainer: {
        marginBottom: '8px',
    },
}));

const Dashboard = () => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" className={classes.mainContainer}>
            <Grid container>
                <TextChart />
                <KpiEmailCampaign />
                <Grid item xs={12}>
                    <p className={classes.title}>
                        <img src="/images/smartphone.svg" alt="smartphone-logo" className={classes.phoneImg} />
                        <span>Application mobile</span>
                    </p>
                </Grid>
                <Grid container spacing={2} className={classes.kpiContainer}>
                    <Grid item xs={12} lg={6}>
                        <Grid item className="with-background dc-container">
                            <DownloadsCount />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                        <Grid item className="with-background dc-container">
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
};
export default Dashboard;
