import { Link } from 'react-router-dom';
import {
    Grid, Container, Button, makeStyles, createStyles,
} from '@material-ui/core';
import KpiEmailCampaign from '../Dashboard/Charts/KpiEmailCampaign';
import SentEmailCampaignList from '../Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList';
import PATHS from '../../paths';

const useStyles = makeStyles((theme) => createStyles({
    root: {
        '&:hover': {
            backgroundColor: theme.palette.whiteCorner,
        },
    },
    pageTitle: {
        fontSize: '32px',
        fontWeight: '600',
    },
    mailButtonContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    buttonLink: {
        marginTop: '6px',
    },
    messagerieMailButton: {
        fontSize: '14px',
        fontWeight: '600',
        color: theme.palette.blue2Corner,
        backgroundColor: theme.palette.whiteCorner,
        marginBottom: '10px',
        padding: '4px 16px',
        border: 'none',
        borderRadius: '79px',
        textTransform: 'none',
    },
    messagerieKpi: {
        backgroundColor: 'rgba(19, 92, 235, 0.05)',
        marginBottom: '16px',
        borderRadius: '6px',
    },
    kpiTitle: {
        color: theme.palette.blackCorner,
        fontSize: '20px',
        fontWeight: '600',
        margin: '16px',
    },
    kpiComponent: {
        padding: '0 32px',
    },
}));

const Dashboard = () => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="space-between">
                <Grid item>
                    <span className={classes.pageTitle}>Messagerie</span>
                </Grid>
                <Grid item className={classes.mailButtonContainer}>
                    <Link to={PATHS.MESSAGERIE_CREATE.route} className={classes.buttonLink}>
                        <Button
                            type="button"
                            disableRipple
                            className={classes.messagerieMailButton}
                            classes={{ root: classes.root }}
                            endIcon={<img src="/images/arrow-right.svg" alt="right arrow" />}
                        >
                            Envoyer un email
                        </Button>
                    </Link>
                </Grid>
            </Grid>
            <Grid container className={classes.messagerieKpi}>
                <Grid container>
                    <Grid item xs={12} className={classes.kpiTitle}>
                        En quelques chiffres
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className={classes.kpiComponent}>
                        <KpiEmailCampaign />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <SentEmailCampaignList />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
