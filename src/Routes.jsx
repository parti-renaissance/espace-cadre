import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import Spinner from './components/Spinner/Spinner';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Contacts = lazy(() => import('./components/ContactsPage'));
const Auth = lazy(() => import('./components/Auth'));
const Mail = lazy(() => import('./components/Mail'));

const PATHS = {
    DASHBOARD: {
        route: '/',
        url: () => '/',
        label: 'Dashboard',
        icon: 'fas fa-th-large',
    },
    CONTACTS: {
        route: '/contacts',
        url: () => '/contacts',
        label: 'Contacts',
        icon: 'fas fa-users',
    },
    AUTH: {
        route: '/auth',
        url: () => '/auth',
    },
    MAIL: {
        route: '/mail',
        url: () => '/mail',
        label: 'Messagerie',
        icon: 'far fa-paper-plane',
    },
};

export const MENU = [
    PATHS.DASHBOARD,
    PATHS.CONTACTS,
    PATHS.MAIL,
];

const Routes = () => {
    const history = useHistory();

    useEffect(() => history.listen((_, action) => {
        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }), [history]);

    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route path={PATHS.DASHBOARD.route} exact component={Dashboard} />
                <Route path={PATHS.CONTACTS.route} exact component={Contacts} />
                <Route path={PATHS.AUTH.route} exact component={Auth} />
                <Route path={PATHS.MAIL.route} exact component={Mail} />
            </Switch>
        </Suspense>
    );
};

export default Routes;
