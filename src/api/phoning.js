import { saveAs } from 'file-saver'
import { format } from 'date-fns'

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
} from 'domain/phoning'
import { newPaginatedResult } from 'api/pagination'

export const getPhoningGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns/kpi')
  const campaignsKPI = new PhoningCampaignsKPI(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveysKPI = new PhoningSurveysKPI(data.nb_surveys, data.nb_surveys_last_30d)
  const callsKPI = new PhoningCallsKPI(data.nb_calls, data.nb_calls_last_30d)
  return new PhoningGlobalKPI(campaignsKPI, surveysKPI, callsKPI)
}

export const getPhoningCampaignListQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns')
  return data.items.map(c => {
    const team = new PhoningCampaignsTeam(c.team.name, c.team.members_count)
    const campaignGlobalGoal = Number(c.goal) * Number(team.membersCount)
    const score = new PhoningCampaignsScore(c.nb_surveys, campaignGlobalGoal)
    return new PhoningCampaigns(c.uuid, new Date(c.finish_at), c.title, c.creator, team, score)
  })
}

export const getPhoningCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}`)
  const calls = new PhoningCampaignCalls(data.nb_calls, data.to_remind)
  const surveys = new PhoningCampaignSurveys(data.nb_surveys, data.goal * data.team.members_count)
  const team = new PhoningCampaignTeam(data.team.uuid, data.team.name)
  const survey = new PhoningCampaignSurvey(data.survey.uuid, data.survey.name)
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
    new Date(data.created_at),
    new Date(data.finish_at),
    calls,
    surveys,
    data.average_calling_time,
    data.goal,
    data.brief,
    team,
    survey,
    filters
  )
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/callers`)
  return data.map(c => new PhoningCampaignCallers(c.firstName, c.lastName, Number(c.nb_surveys)))
}

export const getPhoningCampaignHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/phoning_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const adherent = h.adherent
      ? new PhoningCampaignHistoryAdherent(
          h.adherent.first_name,
          h.adherent.last_name,
          h.adherent.gender,
          h.adherent.age
        )
      : null
    const caller = new PhoningCampaignHistoryCaller(h.caller.first_name, h.caller.last_name)
    return new PhoningCampaignHistory(h.uuid, h.status, new Date(h.begin_at), adherent, caller)
  })

  return newPaginatedResult(history, data.metadata)
}

export const getPhoningCampaignSurveysReplies = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/replies`)
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(
      sr =>
        new PhoningCampaignReply(
          sr.answers.map(a => new PhoningCampaignReplyAnswer(a.type, a.answer, a.question)),
          sr.phoning_campaign_history.adherent?.first_name,
          sr.phoning_campaign_history.adherent?.last_name,
          new Date(sr.phoning_campaign_history.begin_at),
          new Date(sr.phoning_campaign_history.finish_at)
        )
    ),
  }
}

export const getPhoningCampaignSurveysRepliesExport = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/replies.xls`)
  saveAs(new Blob([data]), `Questionnaires Phoning - ${format(new Date(), 'dd.MM.yyyy')}.xlsx`)
}

export const getPhoningCampaignTeams = async ({ itemsPerPage: pageSize = 99999 } = {}) => {
  const data = await apiClient.get(`/api/v3/teams?page_size=${pageSize}`)
  return data.items.map(t => new PhoningCampaignTeam(t.uuid, t.name, t.members_count))
}

export const getPhoningCampaignSurveys = async ({ itemsPerPage: pageSize = 99999 } = {}) => {
  const data = await apiClient.get(`/api/v3/surveys?page_size=${pageSize}`)
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
