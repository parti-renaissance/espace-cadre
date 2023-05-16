import { apiClient } from 'services/networking/client'
import {
  DTDGlobalKPI,
  DTDGlobalKPICampaigns,
  DTDGlobalKPISurveys,
  DTDGlobalKPIDoors,
  DTDCampaign,
  DTDCampaignItem,
  DTDCampaignItemScore,
  DTDCampaignDetail,
  DTDCampaignDetailKPI,
  DTDCampaignDetailKPIRemaining,
  DTDCampaignDetailKPISurveys,
  DTDCampaignDetailKPIDoors,
  DTDCampaignDetailKPIContacts,
  DTDCampaignDetailKPIAddresses,
  DTDCampaignDetailQuestioner,
  DTDCampaignDetailHistory,
  DTDCampaignDetailHistoryAddress,
  DTDCampaignDetailHistoryQuestioner,
  DTDCampaignDetailSurveysReply,
  DTDCampaignDetailSurveysReplyAnswer,
  DTDCampaignDetailSurveysAddress,
  DTDLocalPollingStations,
} from 'domain/DTD'
import { newPaginatedResult } from 'api/pagination'
import { formatISO } from 'date-fns'
import { downloadFile } from './upload'

export const getDTDGlobalKPIQuery = async () => {
  const data = await apiClient.get('api/v3/pap_campaigns/kpi')
  const campaigns = new DTDGlobalKPICampaigns(data.nb_campaigns, data.nb_ongoing_campaigns)
  const surveys = new DTDGlobalKPISurveys(data.nb_surveys, data.nb_surveys_last_30d)
  const doors = new DTDGlobalKPIDoors(data.nb_visited_doors, data.nb_visited_doors_last_30d)
  return new DTDGlobalKPI(campaigns, surveys, doors)
}

export const getDTDCampaignsQuery = async ({ pageParam: page = 1 }) => {
  const query = `?order[created_at]=desc&page=${page}&page_size=20`
  const data = await apiClient.get(`api/v3/pap_campaigns${query}`)
  const campaigns = data.items.map(c => {
    const score = new DTDCampaignItemScore(
      c.nb_surveys,
      c.goal,
      c.nb_visited_doors,
      c.nb_addresses,
      c.nb_voters,
      c.nb_vote_places,
      c.nb_collected_contacts
    )
    return new DTDCampaignItem(
      c.uuid,
      c.creator,
      new Date(c.begin_at),
      new Date(c.finish_at),
      c.title,
      score,
      c.enabled
    )
  })

  return newPaginatedResult(campaigns, data.metadata)
}

export const getDTDCampaignQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}`)
  return new DTDCampaign('', data.title, data.goal, data.begin_at, data.finish_at, data.survey.uuid, data.brief)
}

export const getDTDCampaignDetailQuery = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}`)
  const remaining = new DTDCampaignDetailKPIRemaining(new Date(data.begin_at), new Date(data.finish_at))
  const surveys = new DTDCampaignDetailKPISurveys(data.nb_surveys)
  const doors = new DTDCampaignDetailKPIDoors(data.nb_visited_doors, data.nb_open_doors)
  const contacts = new DTDCampaignDetailKPIContacts(data.nb_collected_contacts, data.nb_to_join)
  const addresses = new DTDCampaignDetailKPIAddresses(
    data.nb_addresses_todo,
    data.nb_addresses_ongoing,
    data.nb_addresses_completed
  )
  const KPI = new DTDCampaignDetailKPI(remaining, surveys, doors, contacts, addresses)
  return new DTDCampaignDetail(data.uuid, data.title, data.goal, KPI)
}

export const getDTDCampaignQuestioners = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaigns/${campaignId}/questioners?order[created_at]=desc&page=${page}&page_size=20`
  )
  const questioners = data.items.map(
    c => new DTDCampaignDetailQuestioner(c.first_name, c.last_name, Number(c.nb_surveys))
  )

  return newPaginatedResult(questioners, data.metadata)
}

export const getDTDCampaignDetailHistory = async ({ campaignId, pageParam: page = 1 }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaign_histories?campaign.uuid=${campaignId}&order[created_at]=desc&page=${page}&page_size=20`
  )

  const history = data.items.map(h => {
    const address = h.building
      ? new DTDCampaignDetailHistoryAddress(
          h.building.address.number ?? '',
          h.building.address.address,
          h.building.address.postal_codes[0],
          h.building.address.city_name,
          h.building_block,
          String(h.floor),
          h.door
        )
      : null
    const questioner = h.questioner
      ? new DTDCampaignDetailHistoryQuestioner(
          h.questioner.first_name,
          h.questioner.last_name,
          h.questioner.gender,
          h.questioner.age
        )
      : null
    return new DTDCampaignDetailHistory(h.uuid, h.status, address, questioner, new Date(h.created_at), h.duration)
  })

  return newPaginatedResult(history, data.metadata)
}

export const getDTDCampaignSurveysReplies = async ({ campaignId, pageSize, pageNumber }) => {
  const data = await apiClient.get(
    `api/v3/pap_campaigns/${campaignId}/replies?page=${pageNumber + 1}&page_size=${pageSize}`
  )
  return {
    totalCount: data.metadata.total_items,
    replies: data.items.map(sr => {
      const questioner = sr.pap_campaign_history.questioner
        ? new DTDCampaignDetailHistoryQuestioner(
            sr.pap_campaign_history.questioner.first_name,
            sr.pap_campaign_history.questioner.last_name,
            sr.pap_campaign_history.questioner.gender,
            sr.pap_campaign_history.questioner.age
          )
        : null

      return new DTDCampaignDetailSurveysReply(
        sr.answers.map(a => new DTDCampaignDetailSurveysReplyAnswer(a.type, a.answer, a.question)),
        questioner,
        sr.pap_campaign_history.duration,
        new Date(sr.pap_campaign_history.created_at),
        sr.pap_campaign_history.first_name,
        sr.pap_campaign_history.last_name,
        sr.pap_campaign_history.gender,
        sr.pap_campaign_history.age_range,
        sr.pap_campaign_history.profession,
        sr.pap_campaign_history.email_address,
        sr.pap_campaign_history.voter_postal_code
      )
    }),
  }
}

export const getPhoningCampaignSurveysRepliesExport = campaignId =>
  downloadFile(`api/v3/pap_campaigns/${campaignId}/replies.xls`)

export const getDTDCampaignSurveysAddress = async ({ campaignId, pageSize = 20, pageNumber = 0, sortParams = [] }) => {
  const queryParams = [`page=${pageNumber + 1}`, `page_size=${pageSize}`].concat(
    sortParams.map(sortItem => `order[${sortItem.key}]=${sortItem.value}`)
  )

  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/building_statistics?${queryParams.join('&')}`)

  return {
    totalCount: data.metadata.total_items,
    addresses: data.items.map(sa => {
      const questioner = sa.last_passage_done_by
        ? new DTDCampaignDetailHistoryQuestioner(sa.last_passage_done_by.first_name, sa.last_passage_done_by.last_name)
        : null
      return new DTDCampaignDetailSurveysAddress(
        sa.building.address.address,
        sa.building.address.city_name,
        sa.building.address.insee_code,
        sa.building.type,
        sa.status,
        sa.nb_visited_doors,
        questioner
      )
    }),
  }
}

export const getDTDCampaignPollingStations = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/available_vote_places?pagination=false`)

  const pollingStations = data.map(
    station => new DTDLocalPollingStations(station.uuid, station.code, station.nb_addresses, station.nb_voters)
  )

  return pollingStations
}

export const getDTDCampaignSelectedPollingStations = async campaignId => {
  const data = await apiClient.get(`api/v3/pap_campaigns/${campaignId}/vote_places?pagination=false`)

  const pollingStations = data.map(
    station => new DTDLocalPollingStations(station.uuid, station.code, station.nb_addresses, station.nb_voters)
  )

  return pollingStations
}

export const createDTDLocalCampaign = async campaign => {
  const data = await apiClient.post('api/v3/pap_campaigns', {
    title: campaign.title,
    brief: campaign.brief,
    goal: +campaign.goal,
    begin_at: formatISO(campaign.startDate),
    finish_at: formatISO(campaign.endDate),
    survey: campaign.survey,
    vote_places: campaign.votePlaces,
  })
  return data.uuid
}

export const updateDTDLocalCampaign = async campaign => {
  await apiClient.put(`api/v3/pap_campaigns/${campaign.id}`, {
    title: campaign.title,
    brief: campaign.brief,
    goal: +campaign.goal,
    begin_at: formatISO(new Date(campaign.startDate)),
    finish_at: formatISO(new Date(campaign.endDate)),
    survey: campaign.survey,
    vote_places: campaign.votePlaces,
  })
}

export const toggleActivateCampaign = async ({ id, isPublished }) => {
  await apiClient.put(`api/v3/pap_campaigns/${id}`, { enabled: isPublished })
  return isPublished
}

export const deleteDTDCampaignQuery = campaignId => apiClient.delete(`api/v3/pap_campaigns/${campaignId}`)
