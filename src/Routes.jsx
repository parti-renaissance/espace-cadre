import React, { Suspense, lazy, useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import Spinner from './components/Spinner/Spinner';

const Auth = lazy(() => import('./components/Auth'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Contacts = lazy(() => import('./components/ContactsPage'));
const Messagerie = lazy(() => import('./components/Messagerie'));
const Mail = lazy(() => import('./components/Mail'));

const PATHS = {
    AUTH: {
        route: '/auth',
        url: () => '/auth',
    },
    DASHBOARD: {
        route: '/',
        url: () => '/',
        label: 'Vue d\'ensemble',
        icon: 'fas fa-th-large',
    },
    CONTACTS: {
        route: '/contacts',
        url: () => '/contacts',
        label: 'Contacts',
        icon: 'fas fa-users',
    },
    MESSAGERIE: {
        route: '/messagerie',
        url: () => '/messagerie',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MAIL: {
        route: '/mail',
        url: () => '/mail',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
};

export const MENU = [
    PATHS.DASHBOARD,
    PATHS.CONTACTS,
    PATHS.MESSAGERIE,
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
                <Route path={PATHS.AUTH.route} exact component={Auth} />
                <Route path={PATHS.DASHBOARD.route} exact component={Dashboard} />
                <Route path={PATHS.CONTACTS.route} exact component={Contacts} />
                <Route path={PATHS.MESSAGERIE.route} exact component={Messagerie} />
                <Route path={PATHS.MAIL.route} exact component={Mail} />
            </Switch>
        </Suspense>
    );
};

export default Routes;
