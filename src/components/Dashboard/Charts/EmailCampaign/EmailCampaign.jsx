import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignCache, useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';

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
                        <div className="row">
                            <p className="mail-title"><i className="fas fa-envelope mr-2" />Campagnes d&apos;emails</p>
                        </div>
                        <div className="row mb-3">
                            <div className="col mr-3 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.nb_campagnes}</div>
                                <div className="main-text">Campagnes</div>
                                <div className="secondary-text">Envoyées en {new Date().getFullYear()}</div>
                            </div>
                            <div className="col mr-3 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.tx_ouverture * 100}%</div>
                                <div className="main-text">Ouvertures</div>
                                <div className="secondary-text">{emailCampaign.national.tx_ouverture * 100}% au national</div>
                            </div>
                            <div className="col mr-3 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.tx_clique * 100}%</div>
                                <div className="main-text">Clics</div>
                                <div className="secondary-text">{emailCampaign.national.tx_clique * 100}% au national</div>
                            </div>
                            <div className="col mr-0 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.tx_desabonnement * 100}%</div>
                                <div className="main-text">Désabonnements</div>
                                <div className="secondary-text">{emailCampaign.national.tx_desabonnement * 100}% au national</div>
                            </div>
                        </div>
                    </>
                )
                : <div className="with-background text-center"><Loader /></div>}
            {emailCampaignReports !== null && emailCampaignReports.campagnes.length > 0
                ? (
                    <div className="row">
                        <div className="col-12 col-lg with-background dc-container mr-lg-3 medium-card">
                            <p className="headline">{emailCampaignReports.campagnes[0].titre}</p>
                            <p className="subtitle-text-card">Le {emailCampaignReports.campagnes[0].date}, par {emailCampaignReports.campagnes[0].auteur}</p>
                            <div className="row p-3">
                                <div className="col flash-card mr-3">
                                    <div className="info-number">{emailCampaignReports.campagnes[0].nb_emails}</div>
                                    <div className="text-below-info-number">Emails</div>
                                </div>
                                <div className="col flash-card mr-3">
                                    <div className="info-number">{emailCampaignReports.campagnes[0].nb_ouvertures}</div>
                                    <div className="text-below-info-number">Ouvertures</div>
                                </div>
                                <div className="col flash-card">
                                    <div className="info-number">{emailCampaignReports.campagnes[0].nb_cliques}</div>
                                    <div className="text-below-info-number">Clics</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg with-background dc-container mr-lg-3 medium-card">
                            <p className="headline">{emailCampaignReports.campagnes[1].titre}</p>
                            <p className="subtitle-text-card">Le {emailCampaignReports.campagnes[1].date}, par {emailCampaignReports.campagnes[1].auteur}</p>
                            <div className="row p-3">
                                <div className="col flash-card mr-3">
                                    <div className="info-number">{emailCampaignReports.campagnes[1].nb_emails}</div>
                                    <div className="text-below-info-number">Emails</div>
                                </div>
                                <div className="col flash-card mr-3">
                                    <div className="info-number">{emailCampaignReports.campagnes[1].nb_ouvertures}</div>
                                    <div className="text-below-info-number">Ouvertures</div>
                                </div>
                                <div className="col flash-card">
                                    <div className="info-number">{emailCampaignReports.campagnes[1].nb_cliques}</div>
                                    <div className="text-below-info-number">Clics</div>
                                </div>
                            </div>
                        </div>
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
