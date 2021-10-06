import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => createStyles({
    gridItem: {
        marginBottom: '16px',
        color: theme.palette.grayCorner3,
        fontSize: '20px',
        fontWeight: '700',
    },
    img: {
        margin: '0 .5rem',
        verticalAlign: 'middle',
    },
}));

function EmailCampaignTitle() {
    const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12} className={classes.gridItem}>
                <img src="/images/mail.svg" alt="mail-logo" className={classes.img} />
                <span>Campagnes d&apos;emails</span>
            </Grid>
        </Grid>
    );
}

export default EmailCampaignTitle;
