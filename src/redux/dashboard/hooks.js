/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardAdherents } from './selectors';
import { updateAdherents } from './slice';

export const useDashboardAdherentCache = () => {
    const dispatch = useDispatch();

    const dashboardAdherents = useSelector(getDashboardAdherents);

    const setDashboardAdherents = (body) => dispatch(updateAdherents(body));

    return [dashboardAdherents, setDashboardAdherents];
};
