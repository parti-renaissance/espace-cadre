import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { MENU } from '../../Routes';
import KpiEmailCampaign from '../Dashboard/Charts/KpiEmailCampaign';
import SentEmailCampaign from '../Dashboard/Charts/SentEmailCampaign';

import Mail from '../Mail/Mail';

function Messagerie() {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;

    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    {pageTitle && <span className="page-title">{pageTitle}</span>}
                </div>
                <div className="col">
                    <Link to="/Mail">
                        <button type="button" className="messagerie-send-email">
                            <span className="send-mail-button-text">Envoyer un email</span>
                            <img src="images/arrow-right.svg" alt="right arrow" />
                        </button>
                    </Link>
                </div>
            </div>
            <KpiEmailCampaign />
            <SentEmailCampaign />
        </div>
    );
}

export default Messagerie;
