/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentScope } from './selectors';
import { updateCurrentScope, updateAuthorizedPages } from '../auth';
import { resetStatsState } from '../dashboard';
import { resetContactsState } from '../contacts';
import { apiClient } from '../../services/networking/client';

export const useUserScope = () => {
    const userScope = useSelector(getCurrentScope);
    const dispatch = useDispatch();

    return [userScope, async (scope) => {
        const authorizedPage = await apiClient.get(`/v3/profile/me/scope/${scope.code}`);

        dispatch(updateAuthorizedPages(authorizedPage.features));
        dispatch(updateCurrentScope(scope));
        dispatch(resetStatsState());
        dispatch(resetContactsState());
    }];
};
