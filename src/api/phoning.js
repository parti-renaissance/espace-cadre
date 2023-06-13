import { apiClient } from 'services/networking/client'
import {
  PhoningGlobalKPI,
  PhoningGlobalKPICampaigns,
  PhoningGlobalKPISurveys,
  PhoningGlobalKPICalls,
  PhoningCampaignItem,
  PhoningCampaignItemTeam,
  PhoningCampaignItemScore,
  PhoningCampaignDetail,
  PhoningCampaignDetailKPI,
  PhoningCampaignDetailKPIRemaining,
  PhoningCampaignDetailKPISurveys,
  PhoningCampaignDetailKPICalls,
  PhoningCampaignDetailCaller,
  PhoningCampaignDetailHistory,
  PhoningCampaignDetailHistoryAdherent,
  PhoningCampaignDetailHistoryCaller,
  PhoningCampaignDetailSurveysReply,
  PhoningCampaignDetailSurveysReplyAnswer,
  PhoningCampaignCreateEdit,
  PhoningCampaignCreateEditGlobal,
  PhoningCampaignCreateEditFilters,
  PhoningCampaignCreateEditTeam,
  PhoningCampaignCreateEditSurvey,
  PhoningCampaignCreateEditZone,
} from 'domain/phoning'
import { newPaginatedResult } from 'api/pagination'
import { Zone } from 'domain/zone'
import { ZONE_AUTOCOMPLETE_URI } from 'components/Filters/Element/ZoneAutocomplete'
import { downloadFile } from './upload'

export const getPhoningGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/phoning_campaigns/kpi')
  const campaignsKPI = new PhoningGlobalKPICampaigns(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveysKPI = new PhoningGlobalKPISurveys(data.nb_surveys, data.nb_surveys_last_30d)
  const callsKPI = new PhoningGlobalKPICalls(data.nb_calls, data.nb_calls_last_30d)
  return new PhoningGlobalKPI(campaignsKPI, surveysKPI, callsKPI)
}

export const getPhoningCampaignsQuery = async ({ pageParam: page = 1 }, visibilityParam) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20&visibility=${visibilityParam}`
  const data = await apiClient.get(`api/v3/phoning_campaigns${query}`)

  const campaigns = data.items.map(c => {
    const team = new PhoningCampaignItemTeam(c.team.name, c.team.members_count)
    const score = new PhoningCampaignItemScore(
      c.nb_surveys,
      Number(c.goal) * Number(team.membersCount),
      Number(c.nb_adherents_called)
    )
    return new PhoningCampaignItem(
      c.uuid,
      new Date(c.finish_at),
      c.title,
      c.creator,
      team,
      score,
      c.nb_calls,
      c.nb_adherents_called,
      c.participants_count
    )
  })

  return newPaginatedResult(campaigns, data.metadata)
}

export const getPhoningCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}`)
  const isNational = data.visibility === 'national'
  const remaining = new PhoningCampaignDetailKPIRemaining(new Date(data.created_at), new Date(data.finish_at))
  const surveys = new PhoningCampaignDetailKPISurveys(data.nb_surveys, data.goal * data.team.members_count)
  const calls = new PhoningCampaignDetailKPICalls(data.nb_calls, data.to_remind)
  const KPI = new PhoningCampaignDetailKPI(remaining, surveys, calls, data.average_calling_time)
  const global = isNational
    ? new PhoningCampaignCreateEditGlobal(
        data.title,
        data.goal,
        new Date(data.finish_at),
        data.brief,
        data.visibility,
        null
      )
    : new PhoningCampaignCreateEditGlobal(
        data.title,
        data.goal,
        new Date(data.finish_at),
        data.brief,
        data.visibility,
        new Zone(data.zone.uuid, data.zone.name, data.zone.code)
      )

  const team = new PhoningCampaignCreateEditTeam(data.team.uuid, data.team.name, data.team.members_count)
  const survey = new PhoningCampaignCreateEditSurvey(data.survey.uuid, data.survey.name)
  const filters = data.audience
    ? new PhoningCampaignCreateEditFilters(
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
        data.audience.renaissance_membership,
        data.audience.zones.map(z => new PhoningCampaignCreateEditZone(z.uuid, z.name, z.code))
      )
    : null
  const createEdit = new PhoningCampaignCreateEdit(global, team, survey, filters)
  return new PhoningCampaignDetail(data.uuid, data.title, data.goal, KPI, createEdit)
}

export const getPhoningCampaignCallers = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/callers`)
  return data.map(c => new PhoningCampaignDetailCaller(c.firstName, c.lastName, Number(c.nb_surveys)))
}

export const getPhoningCampaignHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/phoning_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const adherent = h.adherent
      ? new PhoningCampaignDetailHistoryAdherent(
          h.adherent.first_name,
          h.adherent.last_name,
          h.adherent.gender,
          h.adherent.age
        )
      : null
    const caller = new PhoningCampaignDetailHistoryCaller(
      h.caller.first_name,
      h.caller.last_name,
      h.caller.gender,
      h.caller.age
    )
    return new PhoningCampaignDetailHistory(h.uuid, h.status, adherent, caller, new Date(h.begin_at))
  })

  return newPaginatedResult(history, data.metadata)
}

export const getPhoningCampaignSurveysReplies = async campaignId => {
  const data = await apiClient.get(`api/v3/phoning_campaigns/${campaignId}/replies`)
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(sr => {
      const callee = sr.phoning_campaign_history.adherent
        ? new PhoningCampaignDetailHistoryCaller(
            sr.phoning_campaign_history.adherent.first_name,
            sr.phoning_campaign_history.adherent.last_name,
            sr.phoning_campaign_history.adherent.gender,
            sr.phoning_campaign_history.adherent.age
          )
        : null
      return new PhoningCampaignDetailSurveysReply(
        sr.answers.map(a => new PhoningCampaignDetailSurveysReplyAnswer(a.type, a.answer, a.question)),
        callee,
        new Date(sr.phoning_campaign_history.begin_at),
        new Date(sr.phoning_campaign_history.finish_at)
      )
    }),
  }
}

export const getPhoningCampaignSurveysRepliesExport = campaignId =>
  downloadFile(`api/v3/phoning_campaigns/${campaignId}/replies.xls`)

export const getPhoningCampaignTeams = async ({ pageParam: page = 1 }) => {
  const query = `?page=${page}&page_size=1000`
  const data = await apiClient.get(`/api/v3/teams${query}`)

  const teams = data.items.map(t => new PhoningCampaignCreateEditTeam(t.uuid, t.name, t.members_count))
  return newPaginatedResult(teams, data.metadata)
}

export const getPhoningCampaignSurveys = async ({ pageParam: page = 1 }) => {
  const query = `?page=${page}&page_size=1000`
  const data = await apiClient.get(`/api/v3/surveys${query}`)

  const surveys = data.items.map(s => new PhoningCampaignCreateEditSurvey(s.uuid, s.name, s.type))
  return newPaginatedResult(surveys, data.metadata)
}

export const getPhoningCampaignZones = async city => {
  const data = await apiClient.get(`${ZONE_AUTOCOMPLETE_URI}?q=${city}`)
  return data.map(z => new PhoningCampaignCreateEditZone(z.uuid, z.name, z.code))
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
  renaissanceMembership,
  zones,
}) => ({
  ...(gender && { gender }),
  ...(firstName && { firstName }),
  ...(lastName && { lastName }),
  ...(adherentFromDate && { registeredSince: adherentFromDate }),
  ...(adherentToDate && { registeredUntil: adherentToDate }),
  ...(ageMin && { ageMin: +ageMin }),
  ...(ageMax && { ageMax: +ageMax }),
  ...(renaissanceMembership && { renaissanceMembership }),
  ...('boolean' === typeof certified && { isCertified: certified }),
  ...('boolean' === typeof committeeMember && { isCommitteeMember: committeeMember }),
  ...('boolean' === typeof emailSubscribed && { hasEmailSubscription: emailSubscribed }),
  ...('boolean' === typeof SMSSubscribed && { hasSmsSubscription: SMSSubscribed }),
  zones: zones.map(z => z.id),
})

export const createOrUpdatePhoningCampaignQuery = campaign => {
  const body = {
    title: campaign.title,
    goal: +campaign.goal,
    finish_at: campaign.endDate,
    brief: campaign.brief,
    zone: campaign?.zone?.id,
    team: campaign.team.id,
    survey: campaign.survey.id,
    audience: formatFiltersData(campaign.filters),
  }

  if (!campaign.id) {
    return apiClient.post('api/v3/phoning_campaigns', body)
  }

  return apiClient.put(`api/v3/phoning_campaigns/${campaign.id}`, body)
}
