/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentScope } from './selectors';
import { updateCurrentScope, updateAuthorizedPages } from '../auth';
import { resetStatsState } from '../dashboard';
import { resetContactsState } from '../contacts';
import { apiClient } from '../../services/networking/client';

export const useUserScope = () => {
    const currentScope = useSelector(getCurrentScope);
    const dispatch = useDispatch();

    return [currentScope, async (scope) => {
        const authorizedPage = await apiClient.get(`/v3/profile/me/scope/${scope.code}`);

        dispatch(updateCurrentScope(scope));
        dispatch(updateAuthorizedPages(authorizedPage.features));
        dispatch(resetStatsState());
        dispatch(resetContactsState());
    }];
};
