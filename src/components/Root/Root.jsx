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
                            <div className="container-fluid mt-3">
                                <div className="row d-flex headerRow pl-3 mb-3">
                                    <button id="sidebarCollapse" className="mr-3 mt-1" type="button">
                                        <i className="fa fa-bars mr-2" />
                                        <span className="menuText">Menu</span>
                                    </button>
                                    {content}
                                    {currentUser && (
                                        <div className="welcomeMessage ml-md-auto mr-3 mt-3">
                                            <i className="fas fa-user mr-2" />
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
