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
                            <div className="row mb-2 topNavContainer">
                                <div className="col">
                                    <button id="sidebarCollapse" type="button">
                                        <i className="fa fa-bars mr-2" />
                                        Menu
                                    </button>
                                </div>

                                {currentUser && (
                                    <div className="col text-right">
                                        <i className="fas fa-user pr-2" />
                                        Bienvenue {currentUser.firstName}
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                <div className="col">
                                    <Switch isUserLogged={isUserLoggedIn} />
                                </div>
                            </div>
                        </div>
                    </>
                )
                : <Switch isUserLogged={isUserLoggedIn} />}
        </div>
    );
};

export default Root;
