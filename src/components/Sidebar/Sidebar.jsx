import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import MentionsLegales from '../MentionsLegales/MentionsLegales';
import { getAuthorizedPages } from '../../redux/user/selectors';

import { MENU } from '../../Routes';

const Sidebar = () => {
    const authorizedPage = useSelector(getAuthorizedPages);
    const filteredMenu = MENU.filter((item) => authorizedPage && authorizedPage.includes(item.id));

    useEffect(() => {
        $('#sidebar-collapse').on('click', () => {
            $('#sidebar, #content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div className="vertical-nav bg-white" id="sidebar">
                <Link to="/" className="brand-link">
                    <div className="logo-container">
                        <img src="images/bar-chart.svg" alt="bar chart" className="bar-chart-logo" />
                        <div className="logo-text">DataCorner</div>
                        <span className="beta-bubble">beta</span>
                    </div>
                </Link>
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
