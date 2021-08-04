import React, { useState, useEffect } from 'react';
import {
    Grid,
} from '@material-ui/core';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';
import { useUserScope } from '../../../../redux/user/hooks';
import EmailCampaignTitle from './EmailCampaignTitle';
import ErrorComponent from '../../../ErrorComponent/ErrorComponent';

function KpiEmailCampaign() {
    const [emailCampaign, setEmailCampaign] = useEmailCampaignCache();
    const [currentScope] = useUserScope();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getEmailCampaign = async () => {
            try {
                if (emailCampaign === null && currentScope) {
                    setEmailCampaign(await apiClientProxy.get('/mailCampaign/reportsRatios'));
                }
            } catch (error) {
                setHasError(true);
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
                    <Grid container>
                        <Grid item xs={12} md={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.nbCampagnes}</div>
                                <div className="main-text">Campagne{emailCampaign.local.nbCampagnes > 1 && 's'}</div>
                                <div className="secondary-text">Envoyée{emailCampaign.local.nbCampagnes > 1 && 's'} en {new Date().getFullYear()}</div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txOuverture} />
                                </div>
                                <div className="main-text">Ouvertures</div>
                                <div className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txOuverture} /> au national
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txClique} />
                                </div>
                                <div className="main-text">Clics</div>
                                <div className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txClique} /> au national
                                </div>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} lg={3} className="email-card-container">
                            <Grid item className="with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txDesabonnement} />
                                </div>
                                <div className="main-text">Désabonnements</div>
                                <div className="secondary-text">
                                    <ConvertToPercent
                                        valueToConvert={emailCampaign.national.txDesabonnement}
                                    /> au national
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            );
        } if (hasError) {
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
