/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import {
    getDashboardAdherents, getDashboardUsers, getDashboardDownloads, getDashboardDownloadsRatio,
} from './selectors';
import {
    updateAdherents, updateUsers, updateDownloads, updateDownloadsRatio,
} from './slice';

export const useDashboardAdherentCache = () => {
    const dispatch = useDispatch();

    const dashboardAdherents = useSelector(getDashboardAdherents);

    const setDashboardAdherents = (body) => dispatch(updateAdherents(body));

    return [dashboardAdherents, setDashboardAdherents];
};

export const useDashboardUsersCache = () => {
    const dispatch = useDispatch();

    const dashboardUsers = useSelector(getDashboardUsers);

    const setDashboardUsers = (body) => dispatch(updateUsers(body));

    return [dashboardUsers, setDashboardUsers];
};

export const useDashboardDownloadsCache = () => {
    const dispatch = useDispatch();

    const dashboardDownloads = useSelector(getDashboardDownloads);

    const setDashboardDownloads = (body) => dispatch(updateDownloads(body));

    return [dashboardDownloads, setDashboardDownloads];
};

export const useDashboardDownloadsRatioCache = () => {
    const dispatch = useDispatch();

    const dashboardDownloadsRatio = useSelector(getDashboardDownloadsRatio);

    const setDashboardDownloadsRatio = (body) => dispatch(updateDownloadsRatio(body));

    return [dashboardDownloadsRatio, setDashboardDownloadsRatio];
};
