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
    }, [emailCampaignReports]);

    const emailCampaignsContent = () => {
        if (emailCampaignReports !== null && emailCampaignReports[0].campagnes.length > 0) {
            return (emailCampaignReports[0].campagnes.map((el, index) => (
                <div className="col-12 with-background dc-container big-card" key={index + 1}>
                    <p className="headline">{el.titre}</p>
                    <p className="subtitle-text-card">Le {el.date}, par {el.auteur}</p>
                    <div className="row p-3 flash-card-row">
                        <div className="col-5 col-sm flash-card mr-2">
                            <div className="info-number">{el.nbEmails}</div>
                            <div className="text-below-info-number">Email{el.nbEmails > 1 && 's'}</div>
                        </div>
                        <div className="col-5 col-sm flash-card mr-2">
                            <div className="info-number">
                                <ConvertToPercent
                                    valueToConvert={el.txOuverture}
                                />
                                <span className="parenthese-info">({el.nbOuvertures})</span>
                            </div>
                            <div className="text-below-info-number">Ouvertures</div>
                        </div>
                        <div className="col-5 col-sm flash-card mr-2">
                            <div className="info-number">
                                <ConvertToPercent valueToConvert={el.txClique} />
                                <span className="parenthese-info">({el.nbCliques})</span>
                            </div>
                            <div className="text-below-info-number">Clics</div>
                        </div>
                        <div className="col-5 col-sm flash-card">
                            <div className="info-number">
                                <ConvertToPercent valueToConvert={el.txDesabonnement} />
                                <span className="parenthese-info">({el.nbDesabonnements})</span>
                            </div>
                            <div className="text-below-info-number">Désabonnements</div>
                        </div>
                    </div>
                </div>
            )));
        } if (emailCampaignReports !== null && emailCampaignReports[0].campagnes.length === 0) {
            return <div className="col with-background dc-container text-center mb-3">Aucune campagne à afficher</div>;
        }
        return (
            <div className="col with-background dc-container text-center mb-3">
                <Loader />
            </div>
        );
    };

    return (
        <>
            {emailCampaignsContent()}
        </>
    );
}

export default SentEmailCampaignList;
