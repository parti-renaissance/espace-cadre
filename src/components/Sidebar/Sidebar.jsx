import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';

const Sidebar = () => {
    useEffect(() => {
        $('#sidebar-collapse').on('click', () => {
            $('#sidebar, #content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div className="vertical-nav bg-white" id="sidebar">
                <div className="logo-container">
                    <div>
                        <h4 id="data">Data<span id="corner">Corner</span></h4>
                    </div>
                </div>

                <ul className="nav-items-ul">
                    <li>
                        <NavLink
                            to="/"
                            exact
                            className="nav-link"
                            activeClassName="selected"
                        >
                            <i className="fas fa-th-large" />
                            {' '}
                            <span id="dashboard-item">Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/contacts"
                            exact
                            className="nav-link"
                            activeClassName="selected"
                        >
                            <i className="fas fa-users" />
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
                            <i className="far fa-paper-plane" />
                            {' '}
                            <span id="messagerie">Messagerie</span>
                        </NavLink>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;
