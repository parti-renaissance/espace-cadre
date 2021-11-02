
import { Container, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
    bootPageContainer: {
        marginTop: 'calc(100vh - 80vh)',
        textAlign: 'center',
    },
    textContainer: {
        margin: '48px 0',
    },
});

function BootPage() {
    const classes = useStyles();

    return (
        <Container maxWidth="xl" className={classes.bootPageContainer}>
            <Grid container>
                <Grid item xs={12} className={classes.textContainer}>
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
