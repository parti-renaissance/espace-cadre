import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useAsyncFn } from 'react-use';

import login from '../../services/networking/auth';
import { apiClient } from '../../services/networking/client';
import { userLoggedIn, userUpdateData } from './slice';

export const useInitializeAuth = () => () => {
    if (process.env.NODE_ENV !== 'production' && !process.env.REACT_APP_OAUTH_HOST) {
        window.location.href = '/auth?code=fake_authorization_code';
        return;
    }

    window.location.href = `${process.env.REACT_APP_OAUTH_HOST}/oauth/v2/auth?response_type=code&client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}`;
};

export const useRequestAccessToken = () => {
    const dispatch = useDispatch();
    const { push } = useHistory();

    return useAsyncFn(async (code) => {
        const data = await login(code);
        dispatch(userLoggedIn(data));

        push('');
    });
};

export const useGetUserData = () => {
    const dispatch = useDispatch();

    return useAsyncFn(async () => {
        const data = await apiClient.get('/me');
        dispatch(userUpdateData(data));
    });
};
