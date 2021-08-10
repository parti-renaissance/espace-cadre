import React from 'react';
import { Grid } from '@material-ui/core';

function SentEmailCampaignListTitle() {
    return (
        <Grid container className="campaign-list-title">
            <Grid item xs={12}>
                Vos dernières campagnes
            </Grid>
        </Grid>
    );
}

export default SentEmailCampaignListTitle;
