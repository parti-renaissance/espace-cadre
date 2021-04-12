import {useDispatch} from 'react-redux';

import {OAUTH_CLIENT_ID, OAUTH_HOST} from '../../config';
import {useHistory} from 'react-router-dom';
import {useAsyncFn} from "react-use";
import {login} from "../../services/networking/auth";
import {userLoggedIn, userUpdateData} from "./slice";
import {apiClient} from "../../services/networking/client";

export const useInitializeAuth = () => {
    return () => {
        console.log('redirect to '+buildAuthorizationUrl());
        window.location.href = buildAuthorizationUrl();
    }
}

export const useRequestAccessToken = () => {
    const dispatch = useDispatch();
    const {push} = useHistory();

    return useAsyncFn(async (code) => {
        const data = await login(code);
        dispatch(userLoggedIn(data));

        push('');
    });
}

export const useGetUserData = () => {
    const dispatch = useDispatch();

    return useAsyncFn(async () => {
        const data = await apiClient.get('/me');
        dispatch(userUpdateData(data));
    });
}

function buildAuthorizationUrl() {
    return `${OAUTH_HOST}/oauth/v2/auth?response_type=code&client_id=${OAUTH_CLIENT_ID}`;
}
