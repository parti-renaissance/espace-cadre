import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import MentionsLegales from '../MentionsLegales/MentionsLegales';
import { getAuthorizedPages } from '../../redux/user/selectors';
import Scopes from '../Scopes';

import { MENU, PATHS } from '../../Routes';

const Sidebar = () => {
    const authorizedPage = useSelector(getAuthorizedPages);
    const filteredMenu = MENU.filter((item) => authorizedPage && authorizedPage.includes(item.id));

    useEffect(() => {
        $('#sidebar-collapse-button').on('click', () => {
            $('#sidebar, #page-content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div id="sidebar">
                <Link to={PATHS.DASHBOARD.route} className="brand-link">
                    <div className="logo-container">
                        <img src="/images/bar-chart.svg" alt="bar chart" className="bar-chart-logo" />
                        <div className="logo-text">DataCorner</div>
                        <span className="beta-bubble">beta</span>
                    </div>
                </Link>
                <Scopes />
                <ul id="main-nav">
                    {filteredMenu.map((item, index) => (
                        <li key={index}>
                            <NavLink to={item.url()} exact className="nav-link">
                                {item.icon && <i className={`${item.icon}`} />}
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
                <MentionsLegales />
            </div>
        </>
    );
};

export default Sidebar;
