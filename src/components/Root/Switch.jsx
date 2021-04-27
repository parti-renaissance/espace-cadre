import React from 'react';
import { Route, Switch as ReactRouterSwitch } from 'react-router-dom';
import PropTypes from 'prop-types';

import Auth from '../Auth/Auth';
import Home from '../Home/Home';
import Contacts from '../ContactsPage/ContactsComponent/Contacts';
import Mail from '../Mail/Mail';

const Switch = ({ isUserLogged }) => (
    <ReactRouterSwitch>
        {isUserLogged
            ? (
                <>
                    <Route path="/" exact component={Home} />
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
