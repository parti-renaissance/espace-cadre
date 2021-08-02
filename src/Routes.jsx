import React, {
    Suspense, lazy, useEffect, useState,
} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { apiClient } from './services/networking/client';
import { useUserScope } from './redux/user/hooks';

import Spinner from './components/Spinner/Spinner';

const Auth = lazy(() => import('./components/Auth'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const Contacts = lazy(() => import('./components/ContactsPage'));
const Messagerie = lazy(() => import('./components/Messagerie'));
const Mail = lazy(() => import('./components/Mail'));
const Elections = lazy(() => import('./components/Elections/Elections'));
const TextGenerator = lazy(() => import('./components/TextGenerator/TextGenerator'));

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
    ELECTIONS: {
        route: '/elections',
        url: () => '/elections',
        label: 'Elections',
        icon: 'fas fa-map',
    },
    MAIL: {
        route: '/mail',
        url: () => '/mail',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    TEXTGEN: {
        route: '/textGenerator',
        url: () => '/textGenerator',
        label: 'Créateur d\'EDL',
        icon: 'fas fa-brain',
    },
};

export const MENU = [
    PATHS.DASHBOARD,
    PATHS.CONTACTS,
    PATHS.MESSAGERIE,
    PATHS.ELECTIONS,
    // PATHS.TEXTGEN,
];

const Routes = () => {
    const history = useHistory();
    const [currentScope] = useUserScope();
    const [authorizedPage, setAuthorizedPage] = useState([]);

    const getAuthorizedPage = async () => {
        try {
            if (currentScope.code) setAuthorizedPage(await apiClient.get(`/v3/profile/me/scope/${currentScope.code}`));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAuthorizedPage();
    }, [currentScope]);

    useEffect(() => {
        console.log('authorizedPage', authorizedPage.features && authorizedPage.features);
    }, [authorizedPage]);

    useEffect(() => history.listen((_, action) => {
        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }), [history]);

    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route path={PATHS.AUTH.route} exact component={Auth} />
                {authorizedPage.features && authorizedPage.features.includes('dashboard') && <Route path={PATHS.DASHBOARD.route} exact component={Dashboard} />}
                {authorizedPage.features && authorizedPage.features.includes('contacts') && <Route path={PATHS.CONTACTS.route} exact component={Contacts} />}
                {authorizedPage.features && authorizedPage.features.includes('messages') && <Route path={PATHS.MESSAGERIE.route} exact component={Messagerie} />}
                {authorizedPage.features && authorizedPage.features.includes('messages') && <Route path={PATHS.MAIL.route} exact component={Mail} />}
                {authorizedPage.features && authorizedPage.features.includes('elections') && <Route path={PATHS.ELECTIONS.route} exact component={Elections} />}
                <Route path={PATHS.TEXTGEN.route} exact component={TextGenerator} />
            </Switch>
        </Suspense>
    );
};

export default Routes;
