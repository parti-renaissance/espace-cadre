import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
    getCurrentUser, getCurrentScope, isUserLogged, getUserScopes,
} from '../../redux/user/selectors';
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks';

import Sidebar from '../Sidebar/Sidebar';
import PageContent from '../PageContent';
import ScopesPage from '../Scopes/ScopesPage';

const Root = ({ children }) => {
    const initializeAuth = useInitializeAuth();
    const { pathname } = useLocation();
    const isUserLoggedIn = useSelector(isUserLogged);
    const currentUser = useSelector(getCurrentUser);
    const currentScope = useSelector(getCurrentScope);
    const userScopes = useSelector(getUserScopes);
    const [, updateUserData] = useGetUserData();

    useEffect(() => {
        if (isUserLoggedIn) {
            if (currentUser === null) {
                updateUserData();
            }
        } else if (pathname !== '/auth') {
            initializeAuth();
        }
    }, [isUserLoggedIn]);

    if (currentUser && userScopes && currentScope === null) {
        return <ScopesPage />;
    }

    return (
        <>
            <Sidebar />
            <PageContent>{children}</PageContent>
        </>
    );
};

export default Root;

Root.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
};
