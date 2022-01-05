import { apiClient } from 'services/networking/client'

import {
  DTDGlobalKPI,
  DTDCampaignsKPI,
  DTDSurveysKPI,
  DTDCallsKPI,
  DTDCampaigns,
  DTDCampaignsTeam,
  DTDCampaignsScore,
  DTDCampaign,
  DTDCampaignCalls,
  DTDCampaignCallers,
  DTDCampaignHistory,
  DTDCampaignSurveys,
  DTDCampaignHistoryAdherent,
  DTDCampaignHistoryCaller,
  DTDCampaignFilters,
  DTDCampaignTeam,
  DTDCampaignSurvey,
  DTDCampaignZone,
  DTDCampaignReply,
  DTDCampaignReplyAnswer,
} from 'domain/DTD'
import { newPaginatedResult } from 'api/pagination'

export const getDTDGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns/kpi')
  const campaignsKPI = new DTDCampaignsKPI(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveysKPI = new DTDSurveysKPI(data.nb_surveys, data.nb_surveys_last_30d)
  const callsKPI = new DTDCallsKPI(data.nb_visited_doors, data.nb_visited_doors_last_30d)
  return new DTDGlobalKPI(campaignsKPI, surveysKPI, callsKPI)
}

export const getDTDCampaignListQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns')
  return data.items.map(c => {
    const team = new DTDCampaignsTeam(null, null)
    const score = new DTDCampaignsScore(null, c.goal)
    return new DTDCampaigns(c.uuid, new Date(c.finish_at), c.title, null, team, score)
  })
}

export const getDTDCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}`)
  const calls = new DTDCampaignCalls(data.nb_visited_doors, data.nb_collected_contacts)
  const surveys = new DTDCampaignSurveys(data.nb_surveys, data.goal * null)
  const team = new DTDCampaignTeam(null, null)
  const survey = new DTDCampaignSurvey(null, null)
  const filters = data.audience
    ? new DTDCampaignFilters(
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
        data.audience.zones.map(z => new DTDCampaignZone(z.uuid, z.name, z.code))
      )
    : null
  return new DTDCampaign(
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

export const getDTDCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/questioners`)
  return data.items.map(c => new DTDCampaignCallers(c.first_name, c.last_name, Number(c.nb_surveys)))
}

export const getDTDCampaignHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const adherent = h.questioner
      ? new DTDCampaignHistoryAdherent(
          h.questioner.first_name,
          h.questioner.last_name,
          h.questioner.gender,
          h.questioner.age
        )
      : null
    const caller = new DTDCampaignHistoryCaller(h.questioner.first_name, h.questioner.last_name)
    return new DTDCampaignHistory(h.uuid, h.status, new Date(h.created_at), adherent, caller)
  })

  return newPaginatedResult(history, data.metadata)
}

export const getDTDCampaignSurveysReplies = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/replies`)
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(
      sr =>
        new DTDCampaignReply(
          sr.answers.map(a => new DTDCampaignReplyAnswer(a.type, a.answer, a.question)),
          sr.pap_campaign_history.questioner?.first_name,
          sr.pap_campaign_history.questioner?.last_name,
          new Date(null),
          new Date(null)
        )
    ),
  }
}

export const getDTDCampaignTeams = async name => {
  const data = await apiClient.get(`/api/v3/teams?name=${name}`)
  return data.items.map(t => new DTDCampaignTeam(t.uuid, t.name, t.creator))
}

export const getDTDCampaignSurveys = async name => {
  const data = await apiClient.get(`/api/v3/surveys?name=${name}`)
  return data.items.map(s => new DTDCampaignSurvey(s.uuid, s.name, s.type))
}

export const getDTDCampaignZones = async city => {
  const data = await apiClient.get(`/api/v3/zone/autocomplete?q=${city}`)
  return data.map(z => new DTDCampaignZone(z.uuid, z.name, z.code))
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

export const createDTDCampaignQuery = campaign =>
  apiClient.post('api/v3/DTD_campaigns', {
    title: campaign.title,
    goal: +campaign.goal,
    finish_at: campaign.endDate,
    brief: campaign.brief,
    team: campaign.team.id,
    survey: campaign.survey.id,
    ...(Object.keys(campaign.filters).length > 0 ? { audience: formatFiltersData(campaign.filters) } : {}),
  })

export const updateDTDCampaignQuery = campaign =>
  apiClient.put(`api/v3/DTD_campaigns/${campaign.id}`, {
    title: campaign.title,
    goal: +campaign.goal,
    finish_at: campaign.endDate,
    brief: campaign.brief,
    team: campaign.team.id,
    survey: campaign.survey.id,
    ...(Object.keys(campaign.filters).length > 0 ? { audience: formatFiltersData(campaign.filters) } : {}),
  })
