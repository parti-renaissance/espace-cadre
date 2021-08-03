import React, {
    Suspense, lazy, useEffect,
} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAuthorizedPages } from './redux/user/selectors';
import Spinner from './components/Spinner/Spinner';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Contacts = lazy(() => import('./components/ContactsPage'));
const Messagerie = lazy(() => import('./components/Messagerie'));
const Mail = lazy(() => import('./components/Mail'));
const Elections = lazy(() => import('./components/Elections/Elections'));
const TextGenerator = lazy(() => import('./components/TextGenerator/TextGenerator'));
const NoMatch = lazy(() => import('./components/NoMatch/NoMatch'));

export const PATHS = {
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

const COMPONENTS = [
    {
        key: 'dashboard',
        path: PATHS.DASHBOARD,
        component: Dashboard,
    },
    {
        key: 'contacts',
        path: PATHS.CONTACTS,
        component: Contacts,
    },
    {
        key: 'messages',
        path: PATHS.MESSAGERIE,
        component: Messagerie,
    },
    {
        key: 'messages',
        path: PATHS.MAIL,
        component: Mail,
    },
    {
        key: 'elections',
        path: PATHS.ELECTIONS,
        component: Elections,
    },
];

const Routes = () => {
    const history = useHistory();
    const authorizedPage = useSelector(getAuthorizedPages);

    useEffect(() => history.listen((_, action) => {
        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }), [history]);

    const routes = [
        <Route key={-1} path={PATHS.TEXTGEN.route} exact component={TextGenerator} />,
    ];

    if (authorizedPage.length) {
        COMPONENTS.forEach((component, index) => {
            if (authorizedPage.includes(component.key)) {
                routes.push(<Route key={index + 1} path={component.path.route} exact component={component.component} />);
            }
        });
        routes.push(<Route key={-2} component={NoMatch} />);
    }

    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                {routes}
            </Switch>
        </Suspense>
    );
};

export default Routes;
