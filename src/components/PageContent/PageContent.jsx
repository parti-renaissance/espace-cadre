/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { MENU } from '../../Routes';
import { useDashboardAdherentCache } from '../../redux/dashboard/hooks';

const PageContent = ({ children, currentUser }) => {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;
    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }
    const [dashboardAdherents] = useDashboardAdherentCache();
    return (
        <div className="page-content" id="content">
            <div className="container-fluid mt-3">
                <div className="row d-flex header-row pl-3 mb-3">
                    <button id="sidebar-collapse" className="dc-container mr-3 mt-2" type="button">
                        <img src="images/list.svg" alt="Menu button" />
                    </button>

                    {pageTitle && pageTitle !== 'Messagerie' && <span className="page-title">{pageTitle}</span>}

                    {currentUser && (
                        <div className="ml-sm-auto mr-3 mt-3">
                            <Dropdown>
                                <Dropdown.Toggle variant="none">
                                    <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                                    <span className="profile-info">{dashboardAdherents !== null ? <span> Candidat &gt; {dashboardAdherents.zoneName} (11)</span> : ''}</span>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item href="#/action-2">
                                        <span className="profile-role">Référent</span> <br />
                                        <span className="profile-place">Hauts-de-Seine (92)</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">
                                        <span className="profile-role">Référent délégué</span> <br />
                                        <span className="profile-place">Victor Cohen - Hauts-de-Seine (92)</span>
                                    </Dropdown.Item>
                                    <Dropdown.Item href="#/action-3">
                                        <span className="profile-role">Animateur</span> <br />
                                        <span className="profile-place">Courbevoie En Marche (92400)</span>
                                    </Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item href="https://en-marche.fr/">
                                        <span className="profile-role">Retour sur en-marche.fr</span>
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
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
