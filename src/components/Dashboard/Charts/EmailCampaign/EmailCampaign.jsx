import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
import Loader from '../../../Loader';
import { useEmailCampaignCache } from '../../../../redux/dashboard/hooks';

function EmailCampaign() {
    const [emailCampaign, setEmailCampaign] = useEmailCampaignCache();
    console.log(emailCampaign);
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
                                <div className="main-info">{emailCampaign.local.tx_ouverture}</div>
                                <div className="main-text">Ouvertures</div>
                                <div className="secondary-text">{emailCampaign.national.tx_ouverture} au national</div>
                            </div>
                            <div className="col mr-3 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.tx_clique}</div>
                                <div className="main-text">Clics</div>
                                <div className="secondary-text">{emailCampaign.national.tx_clique} au national</div>
                            </div>
                            <div className="col mr-0 mb-3 mb-md-0 with-background dc-container little-card">
                                <div className="main-info">{emailCampaign.local.tx_desabonnement}</div>
                                <div className="main-text">Désabonnements</div>
                                <div className="secondary-text">{emailCampaign.national.tx_desabonnement} au national</div>
                            </div>
                        </div>
                    </>
                )
                : <div className="with-background text-center"><Loader /></div>}
            {/*
            <div className="row">
                <div className="col-12 col-lg with-background dc-container mr-lg-3 medium-card">
                    <p className="headline">Participez au dévoilement de notre programme</p>
                    <p className="subtitle-text-card">Le 24/05/2021 via DataCorner, par Laurent Saint-Martin</p>
                    <div className="row p-3">
                        <div className="col flash-card mr-3">
                            <div className="info-number">1800</div>
                            <div className="text-below-info-number">Contacts</div>
                        </div>
                        <div className="col flash-card mr-3">
                            <div className="info-number">16,2%</div>
                            <div className="text-below-info-number">Ouvertures</div>
                        </div>
                        <div className="col flash-card">
                            <div className="info-number">3,7%</div>
                            <div className="text-below-info-number">Clics</div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-lg with-background dc-container medium-card">
                    <p className="headline">Comment est votre Blanquer ?</p>
                    <p className="subtitle-text-card">Le 07/11/2021 via l&apos;espace candidat, par Mathilde Sarda</p>
                    <div className="row p-3">
                        <div className="col flash-card mr-3">
                            <div className="info-number">1800</div>
                            <div className="text-below-info-number">Contacts</div>
                        </div>
                        <div className="col flash-card mr-3">
                            <div className="info-number">16,2%</div>
                            <div className="text-below-info-number">Ouvertures</div>
                        </div>
                        <div className="col flash-card">
                            <div className="info-number">3,7%</div>
                            <div className="text-below-info-number">Clics</div>
                        </div>
                    </div>
                </div>
            </div> */}
        </>
    );
}

export default EmailCampaign;
