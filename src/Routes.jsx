import React, {
    Suspense, lazy, useEffect,
} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAuthorizedPages } from './redux/user/selectors';
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
        id: 'dashboard',
        route: '/',
        url: () => '/',
        label: 'Vue d\'ensemble',
        icon: 'fas fa-th-large',
    },
    CONTACTS: {
        id: 'contacts',
        route: '/contacts',
        url: () => '/contacts',
        label: 'Contacts',
        icon: 'fas fa-users',
    },
    MESSAGERIE: {
        id: 'messages',
        route: '/messagerie',
        url: () => '/messagerie',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MAIL: {
        id: 'messages',
        route: '/mail',
        url: () => '/mail',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    ELECTIONS: {
        id: 'elections',
        route: '/elections',
        url: () => '/elections',
        label: 'Elections',
        icon: 'fas fa-map',
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
    const authorizedPage = useSelector(getAuthorizedPages);

    useEffect(() => history.listen((_, action) => {
        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }), [history]);

    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route path={PATHS.AUTH.route} exact component={Auth} />
                {authorizedPage && authorizedPage.includes('dashboard') && <Route path={PATHS.DASHBOARD.route} exact component={Dashboard} />}
                {authorizedPage && authorizedPage.includes('contacts') && <Route path={PATHS.CONTACTS.route} exact component={Contacts} />}
                {authorizedPage && authorizedPage.includes('messages') && <Route path={PATHS.MESSAGERIE.route} exact component={Messagerie} />}
                {authorizedPage && authorizedPage.includes('messages') && <Route path={PATHS.MAIL.route} exact component={Mail} />}
                {authorizedPage && authorizedPage.includes('elections') && <Route path={PATHS.ELECTIONS.route} exact component={Elections} />}
                <Route path={PATHS.TEXTGEN.route} exact component={TextGenerator} />
            </Switch>
        </Suspense>
    );
};

export default Routes;
