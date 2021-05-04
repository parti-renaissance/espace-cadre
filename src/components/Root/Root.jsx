import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getCurrentUser, isUserLogged } from '../../redux/user/selectors';
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks';

import Sidebar from '../Sidebar/Sidebar';
import Switch from './Switch';

const Root = () => {
    const isUserLoggedIn = useSelector(isUserLogged);
    const initializeAuth = useInitializeAuth();
    const { pathname } = useLocation();
    const currentUser = useSelector(getCurrentUser);
    const [, updateUserData] = useGetUserData();
    let content;

    useEffect(() => {
        if (isUserLoggedIn) {
            if (currentUser === null) {
                updateUserData();
            }
        } else if (pathname !== '/auth') {
            initializeAuth();
        }
    }, [isUserLoggedIn]);

    if (pathname === '/') {
        content = <span className="pageTitle">Dashboard</span>;
    } else if (pathname === '/contacts') {
        content = <span className="pageTitle">Contacts</span>;
    } else if (pathname === '/mail') {
        content = <span className="pageTitle">Messagerie</span>;
    }

    return (
        <div>
            {isUserLoggedIn
                ? (
                    <>
                        <Sidebar currentUser={currentUser || {}} />
                        <div className="page-content" id="content">
                            <div className="container">
                                <div className="row headerRow">
                                    <div className="col">
                                        <button id="sidebarCollapse" type="button">
                                            <i className="fa fa-bars mr-2" />
                                            <span className="menuText">Menu</span>
                                        </button>
                                        {content}
                                    </div>
                                    {currentUser && (
                                        <div className="col text-md-right welcomeMessage">
                                            <i className="fas fa-user pr-2" />
                                            <span>Bienvenue {currentUser.firstName}</span>
                                        </div>
                                    )}
                                </div>
                                <Switch isUserLogged={isUserLoggedIn} />
                            </div>
                        </div>
                    </>
                )
                : <Switch isUserLogged={isUserLoggedIn} />}
        </div>
    );
};

export default Root;
