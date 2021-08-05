import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    gridItem: {
        marginBottom: '16px',
        color: '#717BA0',
        fontSize: '20px',
        fontWeight: '700',
    },
    img: {
        margin: '0 .5rem',
    },
});

function EmailCampaignTitle() {
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
                <img src="images/mail.svg" alt="mail-logo" className={classes.img} />
                Campagnes d&apos;emails
            </Grid>
        </Grid>
    );
}

export default EmailCampaignTitle;
