import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';

function SentEmailCampaign() {
    const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache();

    useEffect(() => {
        const getEmailCampaignReports = async () => {
            try {
                if (emailCampaignReports === null) {
                    setEmailCampaignReports(await apiClientProxy.get('/mailCampaign/reports'));
                }
            } catch (error) {
                console.log(error);
            }
        };
        getEmailCampaignReports();
    }, []);

    return (
        <div>
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
        </div>
    );
}

export default SentEmailCampaign;
