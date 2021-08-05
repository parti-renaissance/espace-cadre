import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';
import ErrorComponent from '../../../ErrorComponent/ErrorComponent';
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle';

function SentEmailCampaignList() {
    const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getEmailCampaignReports = async () => {
            try {
                if (emailCampaignReports === null) {
                    setEmailCampaignReports(await apiClientProxy.get('/mailCampaign/reports'));
                }
            } catch (error) {
                setHasError(true);
                setErrorMessage(error);
            }
        };
        getEmailCampaignReports();
    }, [emailCampaignReports]);

    const emailCampaignsContent = () => {
        const campaignsExist = emailCampaignReports && emailCampaignReports.map((item) => (item.campagnes.length > 0));
        const noCampaign = emailCampaignReports && emailCampaignReports.map((item) => (item.campagnes.length === 0));

        if (emailCampaignReports !== null && campaignsExist.some((val) => val)) {
            return (
                <>
                    <SentEmailCampaignListTitle />
                    {emailCampaignReports.map((item) => item.campagnes.map((el, index) => (
                        <Grid container className="with-background dc-container big-card" key={index + 1}>
                            <Grid container className="title-row">
                                <Grid item xs={12}>
                                    <p className="headline">{el.titre}</p>
                                </Grid>
                                <Grid item xs={12}>
                                    <p className="subtitle-text-card">Le {el.date}, par {el.auteur}</p>
                                </Grid>
                            </Grid>
                            <Grid container className="flash-card-row">
                                <Grid item xs={5} sm={2} className="flash-card">
                                    <div className="info-number">{el.nbEmails}</div>
                                    <div className="text-below-info-number">Email{el.nbEmails > 1 && 's'}</div>
                                </Grid>
                                <Grid item xs={5} sm={2} className="flash-card">
                                    <div className="info-number">
                                        <ConvertToPercent
                                            valueToConvert={el.txOuverture}
                                        />
                                        <span className="parenthese-info">({el.nbOuvertures})</span>
                                    </div>
                                    <div className="text-below-info-number">Ouvertures</div>
                                </Grid>
                                <Grid item xs={5} sm={2} className="flash-card">
                                    <div className="info-number">
                                        <ConvertToPercent valueToConvert={el.txClique} />
                                        <span className="parenthese-info">({el.nbCliques})</span>
                                    </div>
                                    <div className="text-below-info-number">Clics</div>
                                </Grid>
                                <Grid item xs={5} sm={2} className="flash-card">
                                    <div className="info-number">
                                        <ConvertToPercent valueToConvert={el.txDesabonnement} />
                                        <span className="parenthese-info">({el.nbDesabonnements})</span>
                                    </div>
                                    <div className="text-below-info-number">Désabonnements</div>
                                </Grid>
                            </Grid>
                        </Grid>
                    )))}
                </>
            );
        } if (emailCampaignReports !== null && noCampaign.every((val) => val)) {
            return (
                <>
                    <SentEmailCampaignListTitle />
                    <div className="col with-background dc-container text-center mb-3" style={{ padding: '6px' }}>Aucune campagne à afficher</div>
                </>
            );
        }
        if (hasError) {
            return (
                <div className="w-100">
                    <ErrorComponent errorMessage={errorMessage} />
                </div>
            );
        }
        return (
            <>
                <div className="col with-background dc-container text-center mb-3">
                    <Loader />
                </div>
            </>
        );
    };
    return (
        <>
            {emailCampaignsContent()}
        </>
    );
}

export default SentEmailCampaignList;
