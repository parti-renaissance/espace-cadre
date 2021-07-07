import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks';
import ConvertToPercent from '../../../ConvertToPercent/ConvertToPercent';

function KpiEmailCampaign() {
    const [emailCampaign, setEmailCampaign] = useEmailCampaignCache();

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
    }, [emailCampaign]);

    return (
        <>
            {emailCampaign !== null
                ? (
                    <>
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
        </>
    );
}

export default KpiEmailCampaign;
