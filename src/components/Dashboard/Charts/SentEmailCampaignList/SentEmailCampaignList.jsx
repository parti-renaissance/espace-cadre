import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';
import {
    getCurrentScope,
} from '../../../../redux/user/selectors';

function SentEmailCampaignList() {
    const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache();
    const currentScope = useSelector(getCurrentScope);

    useEffect(() => {
        const getEmailCampaignReports = async () => {
            try {
                if (emailCampaignReports === null) {
                    const encodedScope = btoa(JSON.stringify(currentScope));
                    setEmailCampaignReports(await apiClientProxy.get(`/mailCampaign/reports?scope=${encodedScope}`));
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
