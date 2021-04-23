import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.scss';
import $ from 'jquery';
import PropTypes from 'prop-types';

const Sidebar = ({ currentUser }) => {
    useEffect(() => {
        $('#sidebarCollapse').on('click', () => {
            $('#sidebar, #content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div className="vertical-nav bg-white" id="sidebar">
                <div className="py-4 px-3 mb-4 bg-light">
                    <div className="media d-flex align-items-center">
                        <h4 className="m-0" id="data">Data<span id="corner">Corner</span></h4>
                    </div>
                </div>
                {
                    currentUser
                    && (
                        <div className="ml-3 mb-4">
                            <i className="fas fa-user pr-3 d-inline" />
                            <p className="welcome text-gray d-inline">
                                Bienvenue&nbsp;
                                {currentUser.firstName}
                            </p>
                        </div>
                    )
                }
                <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Stratégie</p>

                <ul className="nav flex-column bg-white mb-0">
                    {/* <li className="nav-item">
                        <NavLink
                            to="/"
                            exact
                            className="nav-link text-dark"
                            activeClassName="active"
                        >
                            <i className="fas fa-th-large mr-2 text-grey fa-fw" />
                            {' '}
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            exact
                            to="/"
                            className="nav-link text-dark"
                            activeClassName="active"
                        >
                            <i className="far fa-chart-bar mr-2 text-grey fa-fw" />
                            {' '}
                            <span>Analyse</span>
                        </NavLink>
                    </li> */}
                    <li className="nav-item">
                        <NavLink
                            exact
                            to="/contacts"
                            className="nav-link text-dark"
                            activeClassName="active"
                        >
                            <i className="fas fa-users mr-2 text-grey fa-lg" />
                            {' '}
                            <span>Contacts</span>
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink
                            exact
                            to="/mail"
                            className="nav-link text-dark"
                            activeClassName="active"
                        >
                            <i className="far fa-paper-plane mr-2 text-grey fa-lg" />
                            {' '}
                            <span>Messagerie</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    currentUser: PropTypes.objectOf(Object).isRequired,
};
