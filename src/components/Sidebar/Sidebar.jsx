import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import $ from 'jquery';
import PropTypes from "prop-types";

const Sidebar = ({ currentUser }) => {
    useEffect(() => {
        $('#sidebarCollapse').on('click', () => {
            console.log('clicked sidebar collapse');
            $('#sidebar, #content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div className="vertical-nav bg-white" id="sidebar">
                <div className="py-4 px-3 mb-4 bg-light">
                    <div className="media d-flex align-items-center">
                        <h4 className="m-0">CRM</h4>
                    </div>
                </div>
                {
                    currentUser &&
                    <div className="ml-3 mb-4">
                        <i className="fas fa-user pr-3 d-inline"></i>
                        <p className="text-gray d-inline">Bienvenue {currentUser.firstName}</p>
                    </div>
                }
                <p className="text-gray font-weight-bold text-uppercase px-3 small pb-4 mb-0">Stratégie</p>

                <ul className="nav flex-column bg-white mb-0">
                    <li className="nav-item">
                        <Link
                            to="/"
                            className="nav-link text-dark"
                        >
                            <i className="fas fa-th-large mr-2 text-grey fa-fw" />
                            {' '}
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/"
                            className="nav-link text-dark"
                        >
                            <i className="far fa-chart-bar mr-2 text-grey fa-fw" />
                            {' '}
                            Analyse
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/contacts"
                            className="nav-link text-dark"
                        >
                            <i className="far fa-address-book mr-2 text-grey fa-fw" />
                            {' '}
                            Contacts
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/mail"
                            className="nav-link text-dark"
                        >
                            <i className="fas fa-envelope-open-text mr-2 text-grey fa-fw" />
                            {' '}
                            Mail
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    currentUser: PropTypes.object.isRequired
};
