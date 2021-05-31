import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignCache, useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';

function EmailCampaign() {
    const [emailCampaign, setEmailCampaign] = useEmailCampaignCache();
    const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache();

    useEffect(() => {
        const getEmailCampaign = async () => {
            try {
                if (emailCampaign === null) {
                    setEmailCampaign(await apiClientProxy.get('/mailCampaign/reportsRatios'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getEmailCampaign();
    }, []);

    useEffect(() => {
        const getEmailCampaignReports = async () => {
            try {
                if (emailCampaign === null) {
                    setEmailCampaignReports(await apiClientProxy.get('/mailCampaign/reports'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getEmailCampaignReports();
    }, []);
    return (
        <>
            {emailCampaign !== null
                ? (
                    <>
                        <div className="row mb-3">
                            <p className="mail-title"><img src="images/mail.svg" alt="mail-logo" className="ml-2 mr-2" />Campagnes d&apos;emails</p>
                        </div>
                        <div className="row">
                            <div className="col-12 col-md mb-3 mr-md-3 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.nbCampagnes}</div>
                                <div className="main-text">Campagne{emailCampaign.local.nbCampagnes > 1 && 's'}</div>
                                <div className="secondary-text">Envoyée{emailCampaign.local.nbCampagnes > 1 && 's'} en {new Date().getFullYear()}</div>
                            </div>
                            <div className="col-12 col-md mb-3 mr-md-3 with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txOuverture} />
                                </div>
                                <div className="main-text">Ouvertures</div>
                                <div className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txOuverture} /> au national
                                </div>
                            </div>
                            <div className="col-12 col-md mb-3 mr-md-3 with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txClique} />
                                </div>
                                <div className="main-text">Clics</div>
                                <div className="secondary-text">
                                    <ConvertToPercent valueToConvert={emailCampaign.national.txClique} /> au national
                                </div>
                            </div>
                            <div className="col-12 col-md mb-0 mb-3 with-background dc-container little-card">
                                <div className="main-info">
                                    <ConvertToPercent valueToConvert={emailCampaign.local.txDesabonnement} />
                                </div>
                                <div className="main-text">Désabonnements</div>
                                <div className="secondary-text">
                                    <ConvertToPercent
                                        valueToConvert={emailCampaign.national.txDesabonnement}
                                    /> au national
                                </div>
                            </div>
                        </div>
                    </>
                )
                : (
                    <div className="row">
                        <div className="col with-background dc-container text-center mb-3">
                            <Loader />
                        </div>
                    </div>
                )}
            {emailCampaignReports !== null && emailCampaignReports.campagnes.length > 0
                ? (
                    <div className="row">
                        <div className="col-12 col-lg mr-lg-3 with-background dc-container big-card">
                            <p className="headline">{emailCampaignReports.campagnes[0].titre}</p>
                            <p className="subtitle-text-card">Le {emailCampaignReports.campagnes[0].date}, par {emailCampaignReports.campagnes[0].auteur}</p>
                            <div className="row p-3">
                                <div className="col flash-card mr-3">
                                    <div className="info-number">{emailCampaignReports.campagnes[0].nbEmails}</div>
                                    <div className="text-below-info-number">Email{emailCampaignReports.campagnes[0].nbEmails > 1 && 's'}</div>
                                </div>
                                <div className="col flash-card mr-3">
                                    <div className="info-number">
                                        <ConvertToPercent
                                            valueToConvert={emailCampaignReports.campagnes[0].txOuverture}
                                        />
                                    </div>
                                    <div className="text-below-info-number">Ouvertures</div>
                                </div>
                                <div className="col flash-card">
                                    <div className="info-number">
                                        <ConvertToPercent valueToConvert={emailCampaignReports.campagnes[0].txClique} />
                                    </div>
                                    <div className="text-below-info-number">Clics</div>
                                </div>
                            </div>
                        </div>
                        {emailCampaignReports.campagnes[1] && (
                            <div className="col-12 col-lg with-background dc-container big-card">
                                <p className="headline">{emailCampaignReports.campagnes[1].titre}</p>
                                <p className="subtitle-text-card">Le {emailCampaignReports.campagnes[1].date}, par {emailCampaignReports.campagnes[1].auteur}</p>
                                <div className="row p-3">
                                    <div className="col flash-card mr-3">
                                        <div className="info-number">{emailCampaignReports.campagnes[1].nbEmails}</div>
                                        <div className="text-below-info-number">Email{emailCampaignReports.campagnes[1].nbEmails > 1 && 's'}</div>
                                    </div>
                                    <div className="col flash-card mr-3">
                                        <div className="info-number">
                                            <ConvertToPercent
                                                valueToConvert={emailCampaignReports.campagnes[1].txOuverture}
                                            />
                                        </div>
                                        <div className="text-below-info-number">Ouvertures</div>
                                    </div>
                                    <div className="col flash-card">
                                        <div className="info-number">
                                            <ConvertToPercent
                                                valueToConvert={emailCampaignReports.campagnes[1].txClique}
                                            />
                                        </div>
                                        <div className="text-below-info-number">Clics</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )
                : (
                    <div className="row">
                        <div className="col with-background dc-container text-center mb-3">
                            <Loader />
                        </div>
                    </div>
                )}
        </>
    );
}

export default EmailCampaign;
