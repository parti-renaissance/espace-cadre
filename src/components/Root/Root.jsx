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

const Root = ({ children }) => {
    const isUserLoggedIn = useSelector(isUserLogged);
    const initializeAuth = useInitializeAuth();
    const { pathname } = useLocation();
    const currentUser = useSelector(getCurrentUser);
    const currentScope = useSelector(getCurrentScope);
    const [, updateUserData] = useGetUserData();
    const userScopes = useSelector(getUserScopes);

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
        return <h1>Page intermédiaire</h1>;
    }

    return (
        <>
            <Sidebar />
            <PageContent currentUser={currentUser || {}}>{children}</PageContent>
        </>
    );
};

export default Root;

Root.propTypes = {
    children: PropTypes.instanceOf(Object).isRequired,
};
