/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentScope } from './selectors';
import { updateCurrentScope } from '../auth';
import { resetStatsState } from '../dashboard';
import { resetContactsState } from '../contacts';

export const useUserScope = () => {
    const userScope = useSelector(getCurrentScope);
    const dispatch = useDispatch();

    return [userScope, (scope) => {
        dispatch(updateCurrentScope(scope));
        dispatch(resetStatsState());
        dispatch(resetContactsState());
    }];
};
