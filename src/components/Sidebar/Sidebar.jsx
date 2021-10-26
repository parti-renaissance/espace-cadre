import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import { getAuthorizedPages } from '../../redux/user/selectors';
import Scopes from '../Scopes';
import { MENU } from '../../Routes';
import Icons from '../../icons';

import { UINavItem } from '../../ui';
import MentionsLegales from '../MentionsLegales/MentionsLegales';

const useStyles = makeStyles((theme) => ({
  navMenu: {
    marginTop: theme.spacing(7),
  },
}));

const Sidebar = () => {
    const authorizedPage = useSelector(getAuthorizedPages);
    const filteredMenu = MENU.filter((item) => authorizedPage && authorizedPage.includes(item.id));
    const classes = useStyles();

    useEffect(() => {
        $('#sidebar-collapse-button').on('click', () => {
            $('#sidebar, #page-content').toggleClass('active');
        });
    }, []);

    return (
        <>
            <div id="sidebar">
                <Link to="/" className="brand-link">
                    <div className="logo-container">
                        <img src="images/bar-chart.svg" alt="bar chart" className="bar-chart-logo" />
                        <div className="logo-text">DataCorner</div>
                        <span className="beta-bubble">beta</span>
                    </div>
                </Link>
                <Scopes />
                <div className={classes.navMenu}>
                    {filteredMenu.map((item) => (
                      <UINavItem key={item.id} path={item.url} label={item.label} icon={Icons[item.id]} />
                    ))}
                </div>
                <MentionsLegales />
            </div>
        </>
    );
};

export default Sidebar;
