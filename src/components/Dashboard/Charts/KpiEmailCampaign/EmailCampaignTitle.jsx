import React from 'react';
import { Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    EmailCampaignTitle: {
        marginRight: '.5rem',
    },
});

function EmailCampaignTitle() {
    const classes = useStyles();
    return (
        <Grid container style={{ marginLeft: '8px' }}>
            <Box mb={3} xs={12}>
                <p className="mail-title">
                    <img src="images/mail.svg" alt="mail-logo" className={classes.EmailCampaignTitle} />
                    Campagnes d&apos;emails
                </p>
            </Box>
        </Grid>
    );
}

export default EmailCampaignTitle;
