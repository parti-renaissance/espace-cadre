import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { isUserLogged, getUserScopes, getCurrentUser } from '../../redux/user/selectors';
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks';
import { useUserScope } from '../../redux/user/hooks';

import Sidebar from '../Sidebar/Sidebar';
import PageContent from '../PageContent';
import ScopesPage from '../Scopes/ScopesPage';
import BootPage from '../BootPage';
import Auth from '../Auth';
import PATHS from '../../paths';

const Layout = ({ children }) => {
    const initializeAuth = useInitializeAuth();
    const { pathname } = useLocation();
    const isUserLoggedIn = useSelector(isUserLogged);
    const currentUser = useSelector(getCurrentUser);
    const [currentScope] = useUserScope();
    const userScopes = useSelector(getUserScopes);
    const [, updateUserData] = useGetUserData();

    useEffect(() => {
        if (isUserLoggedIn) {
            if (currentUser === null) {
                updateUserData();
            }
        } else if (pathname !== PATHS.AUTH.route) {
            initializeAuth();
        }
    }, [currentUser, initializeAuth, isUserLoggedIn, pathname, updateUserData]);

    if (pathname === PATHS.AUTH.route) {
        return <Auth />;
    }
    if (!currentUser || userScopes.length === 0) {
        return <BootPage />;
    }
    if (userScopes && currentScope === null) {
        return <ScopesPage />;
    }

    return (
        <>
            <Sidebar />
            <PageContent>{children}</PageContent>
        </>
    );
};

export default Layout;

Layout.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
};
