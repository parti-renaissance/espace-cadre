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
  PhoningCampaignCallers,
  PhoningCampaignHistory,
  PhoningCampaignSurveys,
  PhoningCampaignHistoryAdherent,
  PhoningCampaignHistoryCaller,
  PhoningCampaignFilters,
  PhoningCampaignTeam,
  PhoningCampaignSurvey,
  PhoningCampaignZone,
  PhoningCampaignReply,
  PhoningCampaignReplyAnswer,
} from 'domain/DTD'
import { newPaginatedResult } from 'api/pagination'

export const getPhoningGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns/kpi')
  const campaignsKPI = new PhoningCampaignsKPI(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveysKPI = new PhoningSurveysKPI(data.nb_surveys, data.nb_surveys_last_30d)
  const callsKPI = new PhoningCallsKPI(data.nb_visited_doors, data.nb_visited_doors_last_30d)
  return new PhoningGlobalKPI(campaignsKPI, surveysKPI, callsKPI)
}

export const getPhoningCampaignListQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns')
  return data.items.map(c => {
    const team = new PhoningCampaignsTeam(null, null)
    const score = new PhoningCampaignsScore(null, c.goal)
    return new PhoningCampaigns(c.uuid, new Date(c.finish_at), c.title, null, team, score)
  })
}

export const getPhoningCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}`)
  const calls = new PhoningCampaignCalls(data.nb_visited_doors, data.nb_collected_contacts)
  const surveys = new PhoningCampaignSurveys(data.nb_surveys, data.goal * null)
  const team = new PhoningCampaignTeam(null, null)
  const survey = new PhoningCampaignSurvey(null, null)
  const filters = data.audience
    ? new PhoningCampaignFilters(
        data.audience.first_name,
        data.audience.last_name,
        data.audience.gender,
        data.audience.registered_since,
        data.audience.registered_until,
        data.audience.age_min,
        data.audience.age_max,
        data.audience.is_certified,
        data.audience.is_committee_member,
        data.audience.has_email_subscription,
        data.audience.has_sms_subscription,
        data.audience.zones.map(z => new PhoningCampaignZone(z.uuid, z.name, z.code))
      )
    : null
  return new PhoningCampaign(
    data.uuid,
    data.title,
    new Date(null),
    new Date(data.finish_at),
    calls,
    surveys,
    data.average_visit_time,
    data.goal,
    data.brief,
    team,
    survey,
    filters
  )
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/questioners`)
  return data.items.map(c => new PhoningCampaignCallers(c.first_name, c.last_name, Number(c.nb_surveys)))
}

export const getPhoningCampaignHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const adherent = h.questioner
      ? new PhoningCampaignHistoryAdherent(
          h.questioner.first_name,
          h.questioner.last_name,
          h.questioner.gender,
          h.questioner.age
        )
      : null
    const caller = new PhoningCampaignHistoryCaller(h.questioner.first_name, h.questioner.last_name)
    return new PhoningCampaignHistory(h.uuid, h.status, new Date(h.created_at), adherent, caller)
  })

  return newPaginatedResult(history, data.metadata)
}

export const getPhoningCampaignSurveysReplies = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/replies`)
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(
      sr =>
        new PhoningCampaignReply(
          sr.answers.map(a => new PhoningCampaignReplyAnswer(a.type, a.answer, a.question)),
          sr.pap_campaign_history.questioner?.first_name,
          sr.pap_campaign_history.questioner?.last_name,
          new Date(null),
          new Date(null)
        )
    ),
  }
}

export const getPhoningCampaignTeams = async name => {
  const data = await apiClient.get(`/api/v3/teams?name=${name}`)
  return data.items.map(t => new PhoningCampaignTeam(t.uuid, t.name, t.creator))
}

export const getPhoningCampaignSurveys = async name => {
  const data = await apiClient.get(`/api/v3/surveys?name=${name}`)
  return data.items.map(s => new PhoningCampaignSurvey(s.uuid, s.name, s.type))
}

export const getPhoningCampaignZones = async city => {
  const data = await apiClient.get(`/api/v3/zone/autocomplete?q=${city}`)
  return data.map(z => new PhoningCampaignZone(z.uuid, z.name, z.code))
}

const formatFiltersData = ({
  firstName,
  lastName,
  gender,
  adherentFromDate,
  adherentToDate,
  ageMin,
  ageMax,
  certified,
  committeeMember,
  emailSubscribed,
  SMSSubscribed,
  zones,
}) => ({
  ...(firstName ? { firstName } : {}),
  ...(lastName ? { lastName } : {}),
  ...(gender ? { gender } : {}),
  ...(adherentFromDate ? { registeredSince: adherentFromDate } : {}),
  ...(adherentToDate ? { registeredUntil: adherentToDate } : {}),
  ...(ageMin ? { ageMin: +ageMin } : {}),
  ...(ageMax ? { ageMax: +ageMax } : {}),
  ...('boolean' === typeof certified ? { isCertified: certified } : {}),
  ...('boolean' === typeof committeeMember ? { isCommitteeMember: committeeMember } : {}),
  ...('boolean' === typeof emailSubscribed ? { hasEmailSubscription: emailSubscribed } : {}),
  ...('boolean' === typeof SMSSubscribed ? { hasSmsSubscription: SMSSubscribed } : {}),
  zones: zones.map(z => z.id),
})

export const createPhoningCampaignQuery = campaign =>
  apiClient.post('api/v3/phoning_campaigns', {
    title: campaign.title,
    goal: +campaign.goal,
    finish_at: campaign.endDate,
    brief: campaign.brief,
    team: campaign.team.id,
    survey: campaign.survey.id,
    ...(Object.keys(campaign.filters).length > 0 ? { audience: formatFiltersData(campaign.filters) } : {}),
  })

export const updatePhoningCampaignQuery = campaign =>
  apiClient.put(`api/v3/phoning_campaigns/${campaign.id}`, {
    title: campaign.title,
    goal: +campaign.goal,
    finish_at: campaign.endDate,
    brief: campaign.brief,
    team: campaign.team.id,
    survey: campaign.survey.id,
    ...(Object.keys(campaign.filters).length > 0 ? { audience: formatFiltersData(campaign.filters) } : {}),
  })
