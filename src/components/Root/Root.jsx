import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { getCurrentUser, isUserLogged } from '../../redux/user/selectors';
import { useGetUserData, useInitializeAuth } from '../../redux/auth/hooks';

import Sidebar from '../Sidebar/Sidebar';
import Switch from './Switch';

import './Root.scss';

const Root = () => {
    const isUserLoggedIn = useSelector(isUserLogged);
    const initializeAuth = useInitializeAuth();
    const { pathname } = useLocation();
    const currentUser = useSelector(getCurrentUser);
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

    return (
        <div>
            {isUserLoggedIn
                ? (
                    <>
                        <Sidebar currentUser={currentUser || {}} />
                        <div className="page-content p-3" id="content">
                            <div className="row mt-4 topNavContainer">
                                <button
                                    id="sidebarCollapse"
                                    type="button"
                                >
                                    <i
                                        id="burgerIcon"
                                        className="fa fa-bars"
                                    />
                                    <span
                                        id="menuButtonText"
                                    >
                                        Menu
                                    </span>
                                </button>
                                {
                                    currentUser
                                    && (
                                        <div className="welcomeContainer">
                                            <i className="fas fa-user pr-3" />
                                            <span className="welcome">
                                                Bienvenue&nbsp;
                                                {currentUser.firstName}
                                            </span>
                                        </div>
                                    )
                                }
                            </div>
                            <Switch isUserLogged={isUserLoggedIn} />
                        </div>
                    </>
                )
                : <Switch isUserLogged={isUserLoggedIn} />}
        </div>
    );
};

export default Root;
