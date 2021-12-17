import { apiClient } from 'services/networking/client'

import {
  PhoningGlobalKPI,
  PhoningCampaignsKPI,
  PhoningSurveysKPI,
  PhoningCallsKPI,
  PhoningCampaigns,
  PhoningCampaignsTeam,
  PhoningCampaignsScore,
  PhoningCampaign,
  PhoningCampaignCalls,
  PhoningCampaignSurveys,
  PhoningCampaignCallers,
  PhoningCampaignHistory,
  PhoningCampaignHistoryAdherent,
  PhoningCampaignHistoryCaller,
} from 'domain/phoning'

export const getPhoningGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns/kpi')
  const campaignsKPI = new PhoningCampaignsKPI(data?.nb_campaigns, data?.nb_ongoing_campaigns)
  const surveysKPI = new PhoningSurveysKPI(data?.nb_surveys, data?.nb_surveys_last_30d)
  const callsKPI = new PhoningCallsKPI(data?.nb_calls, data?.nb_calls_last_30d)
  return new PhoningGlobalKPI(campaignsKPI, surveysKPI, callsKPI)
}

export const getPhoningCampaignListQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns')
  return data.items.map(c => {
    const team = new PhoningCampaignsTeam(c.team?.name, c.team?.members_count)
    const score = new PhoningCampaignsScore(c.nb_calls, c.goal)
    return new PhoningCampaigns(c.uuid, c.finish_at, c.title, c.creator, team, score)
  })
}

export const getPhoningCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}`)
  const calls = new PhoningCampaignCalls(data?.nb_calls, data?.to_remind)
  const surveys = new PhoningCampaignSurveys(data?.nb_surveys, data?.goal * data?.team.members_count)
  return new PhoningCampaign(
    data?.uuid,
    data?.title,
    data?.created_at,
    data?.finish_at,
    calls,
    surveys,
    data?.average_calling_time,
    data?.goal
  )
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/callers`)
  return data?.map(c => new PhoningCampaignCallers(c.firstName, c.lastName, Number(c.nb_surveys)))
}

export const getPhoningCampaignHistory = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaign_histories?campaign.uuid=${campaignId}`)
  return {
    totalCount: data?.metadata?.total_items,
    calls: data?.items.map(h => {
      const adherent = new PhoningCampaignHistoryAdherent(
        h.adherent?.first_name,
        h.adherent?.last_name,
        h.adherent?.gender,
        h.adherent?.age
      )
      const caller = new PhoningCampaignHistoryCaller(h.caller?.first_name, h.caller?.last_name)
      return new PhoningCampaignHistory(h.uuid, h.status, h.begin_at, adherent, caller)
    }),
  }
}
