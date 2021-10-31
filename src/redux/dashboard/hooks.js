import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import {
    getDashboardAdherents,
    getDashboardDownloads,
    getDashboardSurvey,
    getDashboardUsers,
    getEmailCampaign,
    getEmailCampaignReports,
} from './selectors'
import {
    updateAdherents,
    updateDownloads,
    updateEmailCampaign,
    updateEmailCampaignReports,
    updateSurvey,
    updateUsers,
} from './slice'

export const useDashboardAdherentCache = () => {
    const dispatch = useDispatch()

    const dashboardAdherents = useSelector(getDashboardAdherents)

    const setDashboardAdherents = useCallback((body) => dispatch(updateAdherents(body)), [dispatch])

    return [dashboardAdherents, setDashboardAdherents]
}

export const useDashboardUsersCache = () => {
    const dispatch = useDispatch()

    const dashboardUsers = useSelector(getDashboardUsers)

    const setDashboardUsers = useCallback((body) => dispatch(updateUsers(body)), [dispatch])

    return [dashboardUsers, setDashboardUsers]
}

export const useDashboardDownloadsCache = () => {
    const dispatch = useDispatch()

    const dashboardDownloads = useSelector(getDashboardDownloads)

    const setDashboardDownloads = useCallback((body) => dispatch(updateDownloads(body)), [dispatch])

    return [dashboardDownloads, setDashboardDownloads]
}

export const useDashboardSurveyCache = () => {
    const dispatch = useDispatch()

    const dashboardSurvey = useSelector(getDashboardSurvey)

    const setDashboardSurvey = useCallback((body) => dispatch(updateSurvey(body)), [dispatch])

    return [dashboardSurvey, setDashboardSurvey]
}

export const useEmailCampaignCache = () => {
    const dispatch = useDispatch()

    const emailCampaign = useSelector(getEmailCampaign)

    const setEmailCampaign = useCallback((body) => dispatch(updateEmailCampaign(body)), [dispatch])

    return [emailCampaign, setEmailCampaign]
}

export const useEmailCampaignReportsCache = () => {
    const dispatch = useDispatch()

    const emailCampaignReports = useSelector(getEmailCampaignReports)

    const setEmailCampaignReports = useCallback((body) => dispatch(updateEmailCampaignReports(body)), [dispatch])

    return [emailCampaignReports, setEmailCampaignReports]
}
