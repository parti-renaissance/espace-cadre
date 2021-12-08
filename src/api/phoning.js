import { apiClient } from 'services/networking/client'

import GlobalKpi from 'domain/phoning'
import PhoningCampaign, { Calls, Surveys } from 'domain/phoning-campaign'
import PhoningCampaignHistory, { Adherent, Caller } from 'domain/phoning-campaign-history'
import PhoningCampaignCallers from '../domain/phoning-campaign-callers'

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
  const surveys = new Surveys(data.nb_surveys, data.goal * data.team.members_count)
  const calls = new Calls(data.nb_calls, data.to_remind)
  return new PhoningCampaign(
    data.title,
    data.created_at,
    data.finish_at,
    surveys,
    calls,
    secondsToMinutesAndSeconds(data.average_calling_time),
    data.goal
  )
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/callers`)
  return data.map(c => new PhoningCampaignCallers(c.firstName, c.lastName, Number(c.nb_surveys)))
}

export const getPhoningCampaignHistory = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaign_histories?campaign.uuid=${campaignId}`)
  return data?.items.map(
    h =>
      new PhoningCampaignHistory(
        h.uuid,
        h.status,
        h.begin_at,
        new Adherent(h.adherent.first_name, h.adherent.last_name, h.adherent.gender, h.adherent.age),
        new Caller(h.caller.first_name, h.caller.last_name)
      )
  )
}
