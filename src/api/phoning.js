import { apiClient } from '../services/networking/client'
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
