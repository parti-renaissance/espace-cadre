import React, { useEffect } from 'react';
import { apiClientProxy } from '../../../../services/networking/client';
// import Loader from '../../../Loader';
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
        <div className="mb-3">
            <div className="row">
                <p className="mail-title">Campagnes d&apos;emails</p>
            </div>
            <div className="row">
                <div className="col mr-1 with-background dc-container little-card">
                    <span className="main-info">14</span> <br />
                    <span className="main-text">Campagnes</span><br />
                    <span className="secondary-text">Envoyées en 2021</span>
                </div>
                <div className="col mr-1 with-background dc-container little-card">
                    <span className="main-info">28,7%</span> <br />
                    <span className="main-text">Ouvertures</span><br />
                    <span className="secondary-text">23,8% au national</span>
                </div>
                <div className="col mr-1 with-background dc-container little-card">
                    <span className="main-info">5,4%</span> <br />
                    <span className="main-text">Clics</span><br />
                    <span className="secondary-text">3,7% au national</span>
                </div>
                <div className="col mr-1 with-background dc-container little-card">
                    <span className="main-info">0,4%</span> <br />
                    <span className="main-text">Désabonnements</span><br />
                    <span className="secondary-text">0,2% au national</span>
                </div>
            </div>
        </div>
    );
}

export default EmailCampaign;
