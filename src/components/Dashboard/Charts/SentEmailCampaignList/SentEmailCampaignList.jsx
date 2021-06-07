import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';

function SentEmailCampaignList() {
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
        <>
            {emailCampaignReports !== null && emailCampaignReports.campagnes.length > 0
                ? (
                    emailCampaignReports.campagnes.map((el, index) => (
                        <div className="col-md-6 campaign-list-col" key={index + 1}>
                            <div className="col-lg-12 with-background dc-container big-card">
                                <p className="headline">{el.titre}</p>
                                <p className="subtitle-text-card">Le {el.date}, par {el.auteur}</p>
                                <div className="row p-3">
                                    <div className="col flash-card mr-2">
                                        <div className="info-number">{el.nbEmails}</div>
                                        <div className="text-below-info-number">Email{el.nbEmails > 1 && 's'}</div>
                                    </div>
                                    <div className="col flash-card mr-2">
                                        <div className="info-number">
                                            <ConvertToPercent
                                                valueToConvert={el.txOuverture}
                                            />
                                        </div>
                                        <div className="text-below-info-number">Ouvertures</div>
                                    </div>
                                    <div className="col flash-card mr-2">
                                        <div className="info-number">
                                            <ConvertToPercent valueToConvert={el.txClique} />
                                        </div>
                                        <div className="text-below-info-number">Clics</div>
                                    </div>
                                    <div className="col flash-card">
                                        <div className="info-number">
                                            <ConvertToPercent valueToConvert={el.txDesabonnement} />
                                        </div>
                                        <div className="text-below-info-number">Désabonnements</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )
                : (
                    <div className="col with-background dc-container text-center mb-3">
                        <Loader />
                    </div>
                )}
        </>
    );
}

export default SentEmailCampaignList;
