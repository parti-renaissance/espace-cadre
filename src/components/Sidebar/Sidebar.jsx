import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';

const Sidebar = () => {
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

                <ul className="nav flex-column bg-white mb-0">
                    <li>
                        <NavLink
                            to="/"
                            exact
                            className="nav-link"
                            activeClassName="selected"
                        >
                            <i className="fas fa-th-large fa-lg" />
                            {' '}
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contacts"
                            exact
                            className="nav-link"
                            activeClassName="selected"
                        >
                            <i className="fas fa-users fa-lg" />
                            {' '}
                            <span>Contacts</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/mail"
                            exact
                            className="nav-link"
                            activeClassName="selected"
                        >
                            <i className="far fa-paper-plane fa-lg" />
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
