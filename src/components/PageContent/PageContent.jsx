/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import { MENU } from '../../Routes';
import { apiClient } from '../../services/networking/client';

const PageContent = ({ children, currentUser }) => {
    const { pathname } = useLocation();
    const pathIndex = MENU.findIndex((path) => path.route === pathname);
    let pageTitle;
    if (pathIndex !== -1) {
        pageTitle = MENU[pathIndex].label || null;
    }
    const [roles, setRoles] = useState([]);

    function parseName(name) {
        if (name === 'candidate') {
            return 'Candidat';
        } if (name === 'deputy') {
            return 'Député';
        } if (name === 'senator') {
            return 'Sénateur';
        }
        return 'Référent';
    }

    const getScopes = async () => {
        try {
            setRoles(await apiClient.get('/v3/profile/me/scopes'));
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getScopes();
    }, []);

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
                                <Dropdown.Toggle variant="">
                                    <span className="profile-id">{currentUser.firstName} {currentUser.lastName}</span> <br />
                                    {roles.length > 0 && <span className="profile-info">{parseName(roles[0].code)} &gt; {roles[0].zones[0].name} {`(${roles[0].zones[0].code})`}</span>}
                                    <img className="caret-dropdown" src="images/vector.svg" alt="caret" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item href="https://en-marche.fr/">
                                        <span className="profile-role">Retour sur en-marche.fr</span>
                                    </Dropdown.Item>
                                    {roles.length > 0 && roles.slice(1).map((role, i) => (
                                        <Dropdown.Item href="#/action-2" key={i + 1}>
                                            <span className="profile-role">{parseName(role.code)}</span> <br />
                                            <span className="profile-place">{role.zones[0].name} {`(${role.zones[0].code})`}</span>
                                        </Dropdown.Item>
                                    ))}
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
