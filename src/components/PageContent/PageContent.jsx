/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MENU } from '../../Routes';
import Scopes from '../Scopes';
import { getCurrentUser } from '../../redux/user/selectors';

const PageContent = ({ children }) => {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;
    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }
    const currentUser = useSelector(getCurrentUser);

    return (
        <div className="page-content" id="content">
            <div className="container-fluid mt-3">
                <div className="row d-flex header-row pl-3 mb-3">
                    <button id="sidebar-collapse" className="dc-container mr-3 mt-2" type="button">
                        <img src="images/list.svg" alt="Menu button" />
                    </button>
                    {pageTitle && pageTitle !== 'Messagerie' && <span className="page-title">{pageTitle}</span>}
                    <div className="ml-sm-auto mr-3 mt-3">
                        <Scopes currentUser={currentUser} />
                    </div>
                </div>
                {children}
            </div>
        </div>
    );
};

export default PageContent;

PageContent.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
};
