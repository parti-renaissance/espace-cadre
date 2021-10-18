import React, { useState, useEffect } from 'react';
import {
    Grid, Box,
} from '@material-ui/core';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../HelperComponents/Loader';
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../HelperComponents/ConvertToPercent';
import { useUserScope } from '../../../../redux/user/hooks';
import EmailCampaignTitle from './EmailCampaignTitle';
import ErrorComponent from '../../../ErrorComponent/ErrorComponent';

function KpiEmailCampaign() {
    const [emailCampaign, setEmailCampaign] = useEmailCampaignCache();
    const [currentScope] = useUserScope();
    const [errorMessage, setErrorMessage] = useState();

    useEffect(() => {
        const getEmailCampaign = async () => {
            try {
                if (emailCampaign === null && currentScope) {
                    setEmailCampaign(await apiClientProxy.get('/mailCampaign/reportsRatios'));
                }
            } catch (error) {
                setErrorMessage(error);
            }
        };
        getEmailCampaign();
    }, [emailCampaign]);

    const emailCampaignContent = () => {
        if (emailCampaign !== null) {
            return (
                <>
                    <EmailCampaignTitle />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <Box className="main-info">{emailCampaign.local.nbCampagnes}</Box>
                                <Box className="main-text">Campagne{emailCampaign.local.nbCampagnes > 1 && 's'}</Box>
                                <Box className="secondary-text">Envoyée{emailCampaign.local.nbCampagnes > 1 && 's'} en {new Date().getFullYear()}</Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <Box className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txOuverture} />
                                </Box>
                                <Box className="main-text">Ouvertures</Box>
                                <Box className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txOuverture} /> au national
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <Box className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txClique} />
                                </Box>
                                <Box className="main-text">Clics</Box>
                                <Box className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txClique} /> au national
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <Box className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txDesabonnement} />
                                </Box>
                                <Box className="main-text">Désabonnements</Box>
                                <Box className="secondary-text">
                                    <ConvertToPercent
                                        valueToConvert={emailCampaign.national.txDesabonnement}
                                    /> au national
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            );
        } if (errorMessage) {
            return (
                <div className="mb-3">
                    <ErrorComponent errorMessage={errorMessage} />
                </div>
            );
        }
        return (
            <>
                <EmailCampaignTitle />
                <Grid container style={{ marginBottom: '16px' }}>
                    <Grid item xs={12} className="with-background dc-container" style={{ textAlign: 'center' }}>
                        <Loader />
                    </Grid>
                </Grid>
            </>
        );
    };

    return (
        <>
            {emailCampaignContent()}
        </>
    );
}

export default KpiEmailCampaign;
