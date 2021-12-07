import { apiClient } from 'services/networking/client'
import { differenceInDays, format } from 'date-fns'

import GlobalKpi from '../domain/phoning'

export const getGlobalKpiQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns/kpi')
  return new GlobalKpi(
    data.nb_campaigns,
    data.nb_ongoing_campaigns,
    data.nb_calls,
    data.nb_calls_last_30d,
    data.nb_surveys,
    data.nb_surveys_last_30d
  )
}

const secondsToMinutesAndSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  return `
		${minutes > 0 ? `${minutes} min` : ''} 
		${seconds % 60 > 0 ? seconds % 60 : ''}
	`
}

export const getPhoningCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}`)
  return {
    dayRemaining: differenceInDays(new Date(data.finish_at), new Date()),
    surveys: { count: data.nb_surveys, goal: data.goal * data.team.members_count },
    calls: { count: data.nb_calls, toRemind: data.to_remind },
    averageTime: secondsToMinutesAndSeconds(data.average_calling_time),
    goalPerCaller: data.goal,
  }
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/callers`)
  const callers = []
  data.forEach(c => {
    callers.push({
      firstName: c.firstName,
      lastName: c.lastName,
      count: Number(c.nb_surveys),
    })
  })
  return callers
}

export const getPhoningCampaignHistory = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaign_histories?campaign.uuid=${campaignId}`)
  const history = []
  data?.items.forEach(h => {
    history.push({
      id: h.uuid,
      status: h.status,
      adherent: {
        firstName: h.adherent.first_name,
        lastName: h.adherent.last_name,
        gender: h.adherent.gender,
        age: h.adherent.age,
      },
      caller: {
        firstName: h.caller.first_name,
        lastName: h.caller.last_name,
      },
      updateTime: format(new Date(h.begin_at), 'dd/MM/yyyy hh:mm'),
    })
  })
  return history
}
