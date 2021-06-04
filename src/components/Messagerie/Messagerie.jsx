import React from 'react';
import { useLocation } from 'react-router-dom';
import { MENU } from '../../Routes';
import EmailCampaign from '../Dashboard/Charts/EmailCampaign/EmailCampaign';

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
                    <button type="button" className="messagerie-send-email">
                        <span className="send-mail-button-text">Envoyer un email</span>
                        <img src="images/arrow-right.svg" alt="right arrow" />
                    </button>
                </div>
            </div>
            <EmailCampaign />
        </div>
    );
}

export default Messagerie;
