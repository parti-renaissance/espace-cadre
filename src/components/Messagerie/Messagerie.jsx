import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Container } from '@material-ui/core';
import KpiEmailCampaign from '../Dashboard/Charts/KpiEmailCampaign';
import SentEmailCampaignList from '../Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList';

function Messagerie() {
    return (
        <Container maxWidth="lg">
            <Grid container justifyContent="space-between">
                <Grid item>
                    <span className="page-title">Messagerie</span>
                </Grid>
                <Grid item className="mail-button-container">
                    <Link to="/Mail" className="button-link">
                        <button type="button" className="messagerie-mail-button">
                            <span className="button-text">Envoyer un email</span>
                            <img src="images/arrow-right.svg" alt="right arrow" />
                        </button>
                    </Link>
                </Grid>
            </Grid>
            <Grid container className="messagerie-kpi">
                <Grid container>
                    <Grid item xs={12} className="kpi-title">
                        En quelques chiffres
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} className="kpi-component">
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
}

export default Messagerie;
