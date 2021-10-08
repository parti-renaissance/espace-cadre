import React, {
    Suspense, lazy, useEffect,
} from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAuthorizedPages } from './redux/user/selectors';
import Spinner from './components/Spinner/Spinner';

const Dashboard = lazy(() => import('./components/Dashboard'));
const Adherents = lazy(() => import('./components/Adherents'));
const Messagerie = lazy(() => import('./components/Messagerie'));
const MessageTemplate = lazy(() => import('./components/Messagerie/Message/Template'));
const MessageFilter = lazy(() => import('./components/Messagerie/Message/Filters'));
const MessageConfirmation = lazy(() => import('./components/Messagerie/Message/Confirmation'));
const Elections = lazy(() => import('./components/Elections/Elections'));
const NoMatch = lazy(() => import('./components/NoMatch'));

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
    ADHERENTS: {
        id: 'contacts',
        route: '/adherents',
        url: () => '/adherents',
        label: 'Adhérents',
        icon: 'fas fa-users',
    },
    MESSAGERIE: {
        id: 'messages',
        route: '/messagerie',
        url: () => '/messagerie',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_CREATE: {
        id: 'messages',
        route: '/messagerie/creer',
        url: () => '/messagerie/creer',
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_EDIT: {
        id: 'messages',
        route: '/messagerie/:messageUuid/modifier',
        url: (messageUuid) => `/messagerie/${messageUuid}/modifier`,
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_FILTER: {
        id: 'messages',
        route: '/messagerie/:messageUuid/filtrer',
        url: (messageUuid) => `/messagerie/${messageUuid}/filtrer`,
        label: 'Messagerie',
        icon: 'fas fa-paper-plane',
    },
    MESSAGERIE_CONFIRMATION: {
        id: 'messages',
        route: '/messagerie/confirmation',
        url: () => '/messagerie/confirmation',
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
};

export const MENU = [
    PATHS.DASHBOARD,
    PATHS.ADHERENTS,
    PATHS.MESSAGERIE,
    PATHS.ELECTIONS,
];

const COMPONENTS = [
    {
        path: PATHS.DASHBOARD,
        component: Dashboard,
    },
    {
        path: PATHS.ADHERENTS,
        component: Adherents,
    },
    {
        path: PATHS.MESSAGERIE,
        component: Messagerie,
    },
    {
        path: PATHS.MESSAGERIE_CREATE,
        component: MessageTemplate,
    },
    {
        path: PATHS.MESSAGERIE_EDIT,
        component: MessageTemplate,
    },
    {
        path: PATHS.MESSAGERIE_FILTER,
        component: MessageFilter,
    },
    {
        path: PATHS.MESSAGERIE_CONFIRMATION,
        component: MessageConfirmation,
    },
    {
        path: PATHS.ELECTIONS,
        component: Elections,
    },
];

const Routes = () => {
    const history = useHistory();
    const authorizedPage = useSelector(getAuthorizedPages);
    const routes = [];

    useEffect(() => history.listen((_, action) => {
        if (action === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }), [history]);

    if (authorizedPage && authorizedPage.length > 0) {
        COMPONENTS.forEach((component, index) => {
            if (authorizedPage.includes(component.path.id)) {
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
