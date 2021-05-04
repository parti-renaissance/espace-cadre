import React from 'react';
import { Route, Switch as ReactRouterSwitch } from 'react-router-dom';
import PropTypes from 'prop-types';

import Auth from '../Auth/Auth';
import Dashboard from '../DashboardComponent/Dashboard';
import Contacts from '../ContactsPage/ContactsComponent/Contacts';
import Mail from '../Mail';

const Switch = ({ isUserLogged }) => (
    <ReactRouterSwitch>
        {isUserLogged
            ? (
                <>
                    <Route path="/" exact component={Dashboard} />
                    <Route path="/contacts" exact component={Contacts} />
                    <Route path="/mail" exact component={Mail} />
                </>
            )
            : (
                <Route path="/auth" exact component={Auth} />
            )}
    </ReactRouterSwitch>
);

export default Switch;

Switch.propTypes = {
    isUserLogged: PropTypes.bool.isRequired,
};
