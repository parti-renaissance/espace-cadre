import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MENU } from '../../Routes';
import KpiEmailCampaign from '../Dashboard/Charts/KpiEmailCampaign';
import SentEmailCampaignList from '../Dashboard/Charts/SentEmailCampaignList/SentEmailCampaignList';

function Messagerie() {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;

    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }

    return (
        <div className="container">
            <div className="row mb-3">
                <div className="col-12 p-0 col-md">
                    {pageTitle && <span className="page-title">{pageTitle}</span>}
                </div>
                <div className="col-12 p-0 col-md mail-button-container">
                    <Link to="/Mail" className="button-link">
                        <button type="button" className="messagerie-mail-button">
                            <span className="button-text">Envoyer un email</span>
                            <img src="images/arrow-right.svg" alt="right arrow" />
                        </button>
                    </Link>
                </div>
            </div>
            <div className="row messagerie-kpi mb-3">
                <div className="col-12 p-0 kpi-title">En quelques chiffres</div>
                <div className="col-12 kpi-component">
                    <KpiEmailCampaign />
                </div>
            </div>
            <div className="col-12 p-0 campaign-list-title">Vos dernières campagnes</div>
            <div className="row campaign-list-component">
                <SentEmailCampaignList />
            </div>
        </div>
    );
}

export default Messagerie;
