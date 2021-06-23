/* eslint-disable import/prefer-default-export */
import { useDispatch, useSelector } from 'react-redux';
import {
    getDashboardAdherents,
    getDashboardUsers,
    getDashboardDownloads,
    getDashboardDownloadsRatio,
    getDashboardSurvey,
    getEmailCampaign,
    getEmailCampaignReports,
} from './selectors';
import {
    updateAdherents,
    updateUsers,
    updateDownloads,
    updateDownloadsRatio,
    updateSurvey,
    updateEmailCampaign,
    updateEmailCampaignReports,
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

export const useDashboardSurveyCache = () => {
    const dispatch = useDispatch();

    const dashboardSurvey = useSelector(getDashboardSurvey);

    const setDashboardSurvey = (body) => dispatch(updateSurvey(body));

    return [dashboardSurvey, setDashboardSurvey];
};

export const useEmailCampaignCache = () => {
    const dispatch = useDispatch();

    const emailCampaign = useSelector(getEmailCampaign);

    const setEmailCampaign = (body) => dispatch(updateEmailCampaign(body));

    return [emailCampaign, setEmailCampaign];
};

export const useEmailCampaignReportsCache = () => {
    const dispatch = useDispatch();

    const emailCampaignReports = useSelector(getEmailCampaignReports);

    const setEmailCampaignReports = (body) => dispatch(updateEmailCampaignReports(body));

    return [emailCampaignReports, setEmailCampaignReports];
};
