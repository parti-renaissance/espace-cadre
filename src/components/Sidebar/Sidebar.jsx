import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import $ from 'jquery';
import MentionsLegales from '../MentionsLegales/MentionsLegales';

import { MENU } from '../../Routes';

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

                <ul id="main-nav">
                    {MENU.map((item, index) => (
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
