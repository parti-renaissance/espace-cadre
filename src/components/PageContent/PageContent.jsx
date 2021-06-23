import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { MENU } from '../../Routes';

const PageContent = ({ children, currentUser }) => {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;
    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }

    return (
        <div className="page-content" id="content">
            <div className="container-fluid mt-3">
                <div className="row d-flex header-row pl-3 mb-3">
                    <button id="sidebar-collapse" className="dc-container mr-3 mt-2" type="button">
                        <i className="fa fa-bars mr-2" />
                        <span className="menu-text">Menu</span>
                    </button>

                    {pageTitle && pageTitle !== 'Messagerie' && <span className="page-title">{pageTitle}</span>}

                    {currentUser && (
                        <div className="welcome-message ml-sm-auto mr-3 mt-3">
                            <i className="fas fa-user mr-2" />
                            Bienvenue {currentUser.firstName}
                        </div>
                    )}
                </div>

                {children}
            </div>
        </div>
    );
};

export default PageContent;

PageContent.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
    currentUser: PropTypes.instanceOf(Object).isRequired,
};
